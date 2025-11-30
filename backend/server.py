from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    completed: bool = False
    order: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    text: str

class TaskUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    order: Optional[int] = None

class TaskReorder(BaseModel):
    task_ids: List[str]


# Routes
@api_router.get("/")
async def root():
    return {"message": "To-Do List API"}

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks():
    tasks = await db.tasks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for task in tasks:
        if isinstance(task.get('created_at'), str):
            task['created_at'] = datetime.fromisoformat(task['created_at'])
    
    # Sort by order
    tasks.sort(key=lambda x: x.get('order', 0))
    return tasks

@api_router.post("/tasks", response_model=Task)
async def create_task(input: TaskCreate):
    # Get current max order
    existing_tasks = await db.tasks.find({}, {"_id": 0, "order": 1}).to_list(1000)
    max_order = max([t.get('order', 0) for t in existing_tasks], default=-1)
    
    task_obj = Task(text=input.text, order=max_order + 1)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = task_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.tasks.insert_one(doc)
    return task_obj

@api_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, input: TaskUpdate):
    # Find existing task
    existing_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    if update_data:
        await db.tasks.update_one({"id": task_id}, {"$set": update_data})
    
    # Fetch updated task
    updated_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    if isinstance(updated_task.get('created_at'), str):
        updated_task['created_at'] = datetime.fromisoformat(updated_task['created_at'])
    
    return Task(**updated_task)

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    result = await db.tasks.delete_one({"id": task_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

@api_router.put("/tasks/reorder/batch")
async def reorder_tasks(input: TaskReorder):
    # Update order for each task
    for idx, task_id in enumerate(input.task_ids):
        await db.tasks.update_one({"id": task_id}, {"$set": {"order": idx}})
    
    return {"message": "Tasks reordered successfully"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()