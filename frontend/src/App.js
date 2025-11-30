import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Plus, Trash2, GripVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API}/tasks`);
      setTasks(response.data);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching tasks:", e);
      toast.error("Failed to load tasks");
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskText.trim()) {
      toast.error("Please enter a task");
      return;
    }

    try {
      const response = await axios.post(`${API}/tasks`, { text: newTaskText });
      setTasks([...tasks, response.data]);
      setNewTaskText("");
      toast.success("Task added!");
    } catch (e) {
      console.error("Error adding task:", e);
      toast.error("Failed to add task");
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      await axios.put(`${API}/tasks/${taskId}`, { completed: !completed });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      ));
    } catch (e) {
      console.error("Error updating task:", e);
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success("Task deleted");
    } catch (e) {
      console.error("Error deleting task:", e);
      toast.error("Failed to delete task");
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetTask) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.id === targetTask.id) {
      setDraggedTask(null);
      return;
    }

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = tasks.findIndex(t => t.id === targetTask.id);

    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    setTasks(newTasks);
    setDraggedTask(null);

    // Update order in backend
    try {
      const taskIds = newTasks.map(t => t.id);
      await axios.put(`${API}/tasks/reorder/batch`, { task_ids: taskIds });
    } catch (e) {
      console.error("Error reordering tasks:", e);
      toast.error("Failed to reorder tasks");
      fetchTasks(); // Revert to server state
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="app-container">
      <div className="background-gradient"></div>
      
      <div className="content-wrapper">
        <div className="todo-container">
          <div className="header-section">
            <h1 className="main-title" data-testid="app-title">My Tasks</h1>
            <p className="subtitle">Organize your day with drag & drop</p>
          </div>

          <div className="add-task-section">
            <div className="input-wrapper">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="task-input"
                data-testid="new-task-input"
              />
              <Button 
                onClick={addTask} 
                className="add-button"
                data-testid="add-task-button"
              >
                <Plus className="icon" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="tasks-section">
            {loading ? (
              <div className="loading-state" data-testid="loading-state">
                <div className="spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state" data-testid="empty-state">
                <div className="empty-icon">
                  <Check size={48} />
                </div>
                <h3>No tasks yet</h3>
                <p>Add your first task to get started!</p>
              </div>
            ) : (
              <div className="task-list" data-testid="task-list">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, task)}
                    className={`task-item ${task.completed ? 'completed' : ''} ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                    data-testid={`task-item-${task.id}`}
                  >
                    <div className="drag-handle" data-testid={`drag-handle-${task.id}`}>
                      <GripVertical size={20} />
                    </div>
                    
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, task.completed)}
                      className="task-checkbox"
                      data-testid={`task-checkbox-${task.id}`}
                    />
                    
                    <span className="task-text" data-testid={`task-text-${task.id}`}>
                      {task.text}
                    </span>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-button"
                      data-testid={`delete-task-${task.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="footer-stats" data-testid="task-stats">
              <span>{tasks.filter(t => !t.completed).length} active</span>
              <span>•</span>
              <span>{tasks.filter(t => t.completed).length} completed</span>
              <span>•</span>
              <span>{tasks.length} total</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;