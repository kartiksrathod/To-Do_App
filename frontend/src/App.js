import { useState, useEffect } from "react";
import "@/App.css";
import { Plus, Trash2, GripVertical, Check, Search, MoreVertical, Calendar, AlertCircle, Edit2, X, CheckCircle2, Moon, Sun, ChevronDown, ChevronRight, Linkedin, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const STORAGE_KEY = "todo_tasks";
const THEME_KEY = "todo_theme";

const CATEGORIES = [
  { value: "work", label: "Work", color: "#3b82f6" },
  { value: "personal", label: "Personal", color: "#8b5cf6" },
  { value: "shopping", label: "Shopping", color: "#ec4899" },
  { value: "health", label: "Health", color: "#10b981" },
  { value: "other", label: "Other", color: "#6b7280" },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskCategory, setNewTaskCategory] = useState(null);
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [newSubtaskText, setNewSubtaskText] = useState({});

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Error loading tasks:", e);
      }
    }
    setLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  useEffect(() => {
    filterTasks();
  }, [tasks, filter, searchQuery]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
    toast.success(`${newMode ? "Dark" : "Light"} mode activated`);
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (filter === "active") {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter(t => t.completed);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(t => 
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const addTask = () => {
    if (!newTaskText.trim()) {
      toast.error("Please enter a task");
      return;
    }

    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: newTaskText,
      completed: false,
      priority: newTaskPriority,
      category: newTaskCategory,
      due_date: newTaskDueDate ? newTaskDueDate.toISOString() : null,
      subtasks: [],
      order: tasks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setNewTaskText("");
    setNewTaskPriority("medium");
    setNewTaskCategory(null);
    setNewTaskDueDate(null);
    toast.success("Task added!");
  };

  const toggleTask = (taskId, completed) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !completed, updated_at: new Date().toISOString() } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted");
  };

  const clearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    setTasks(tasks.filter(task => !task.completed));
    toast.success(`${completedCount} completed task${completedCount !== 1 ? 's' : ''} cleared`);
  };

  const markAllComplete = () => {
    setTasks(tasks.map(task => ({ ...task, completed: true, updated_at: new Date().toISOString() })));
    toast.success("All tasks marked complete");
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const saveEdit = (taskId) => {
    if (!editingText.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, text: editingText, updated_at: new Date().toISOString() } : task
    ));
    setEditingTaskId(null);
    setEditingText("");
    toast.success("Task updated");
  };

  const updateTaskPriority = (taskId, priority) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, priority, updated_at: new Date().toISOString() } : task
    ));
    toast.success("Priority updated");
  };

  const toggleTaskExpanded = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const addSubtask = (taskId) => {
    const subtaskText = newSubtaskText[taskId]?.trim();
    if (!subtaskText) {
      toast.error("Please enter a subtask");
      return;
    }

    const newSubtask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: subtaskText,
      completed: false
    };

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        return { ...task, subtasks: updatedSubtasks, updated_at: new Date().toISOString() };
      }
      return task;
    }));

    setNewSubtaskText({ ...newSubtaskText, [taskId]: "" });
    toast.success("Subtask added!");
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...task, subtasks: updatedSubtasks, updated_at: new Date().toISOString() };
      }
      return task;
    }));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
        return { ...task, subtasks: updatedSubtasks, updated_at: new Date().toISOString() };
      }
      return task;
    }));
    toast.success("Subtask deleted");
  };

  const getSubtaskProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return null;
    const completed = subtasks.filter(st => st.completed).length;
    return { completed, total: subtasks.length };
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetTask) => {
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

    const reorderedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
      updated_at: new Date().toISOString()
    }));

    setTasks(reorderedTasks);
    setDraggedTask(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.color : "#6b7280";
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="app-container">
      <div className="background-gradient"></div>
      
      <div className="content-wrapper">
        <div className="todo-container">
          <div className="header-section">
            <div className="header-content">
              <div>
                <h1 className="main-title" data-testid="app-title">My Tasks</h1>
                <p className="subtitle">Organize, prioritize, and achieve your goals</p>
              </div>
              
              <div className="header-actions">
                <Button 
                  variant="outline" 
                  className="theme-toggle" 
                  onClick={toggleDarkMode}
                  data-testid="theme-toggle"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="more-button" data-testid="more-actions-button">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" data-testid="more-actions-menu">
                    <DropdownMenuItem onClick={markAllComplete} data-testid="mark-all-complete">
                      <CheckCircle2 className="mr-2" size={16} />
                      Mark All Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={clearCompleted} data-testid="clear-completed">
                      <Trash2 className="mr-2" size={16} />
                      Clear Completed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <div className="keyboard-hint">
                        <kbd>Enter</kbd> to add task
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
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
              
              <div className="task-options">
                <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                  <SelectTrigger className="priority-select" data-testid="priority-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high" data-testid="priority-high">🔴 High</SelectItem>
                    <SelectItem value="medium" data-testid="priority-medium">🟡 Medium</SelectItem>
                    <SelectItem value="low" data-testid="priority-low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={newTaskCategory || "none"} onValueChange={(v) => setNewTaskCategory(v === "none" ? null : v)}>
                  <SelectTrigger className="category-select" data-testid="category-select">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" data-testid="category-none">No Category</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value} data-testid={`category-${cat.value}`}>
                        <span className="category-option">
                          <span className="category-dot" style={{ background: cat.color }}></span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="date-button" data-testid="due-date-picker">
                      <Calendar size={16} />
                      {newTaskDueDate ? format(newTaskDueDate, "MMM d") : "Due"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={newTaskDueDate}
                      onSelect={setNewTaskDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                onClick={addTask} 
                className="add-button"
                data-testid="add-task-button"
              >
                <Plus className="icon" />
                Add
              </Button>
            </div>
          </div>

          <div className="filters-section">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="search-input"
                data-testid="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
                data-testid="filter-all"
              >
                All ({tasks.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
                data-testid="filter-active"
              >
                Active ({activeCount})
              </button>
              <button 
                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
                data-testid="filter-completed"
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          <div className="tasks-section">
            {loading ? (
              <div className="loading-state" data-testid="loading-state">
                <div className="spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state" data-testid="empty-state">
                <div className="empty-icon">
                  <Check size={48} />
                </div>
                <h3>No tasks found</h3>
                <p>
                  {searchQuery ? "Try a different search" : 
                   filter === "completed" ? "No completed tasks yet" :
                   filter === "active" ? "No active tasks" :
                   "Add your first task to get started!"}
                </p>
              </div>
            ) : (
              <div className="task-list" data-testid="task-list">
                {filteredTasks.map((task) => {
                  const isExpanded = expandedTasks.has(task.id);
                  const progress = getSubtaskProgress(task.subtasks);
                  
                  return (
                    <div key={task.id} className="task-wrapper">
                      <div
                        draggable={!editingTaskId}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, task)}
                        className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''} ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                        data-testid={`task-item-${task.id}`}
                      >
                        <div 
                          className="priority-indicator" 
                          style={{ background: getPriorityColor(task.priority) }}
                          data-testid={`priority-indicator-${task.id}`}
                        ></div>
                        
                        <div className="drag-handle" data-testid={`drag-handle-${task.id}`}>
                          <GripVertical size={20} />
                        </div>
                        
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id, task.completed)}
                          className="task-checkbox"
                          data-testid={`task-checkbox-${task.id}`}
                        />
                        
                        <div className="task-content">
                          {editingTaskId === task.id ? (
                            <div className="task-edit-wrapper">
                              <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') saveEdit(task.id);
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                                className="task-edit-input"
                                autoFocus
                                data-testid={`task-edit-input-${task.id}`}
                              />
                              <div className="edit-actions">
                                <button onClick={() => saveEdit(task.id)} className="save-btn" data-testid={`save-edit-${task.id}`}>
                                  <Check size={16} />
                                </button>
                                <button onClick={cancelEdit} className="cancel-btn" data-testid={`cancel-edit-${task.id}`}>
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="task-main">
                                <span className="task-text" data-testid={`task-text-${task.id}`}>
                                  {task.text}
                                </span>
                                <button 
                                  onClick={() => startEdit(task)} 
                                  className="edit-button"
                                  data-testid={`edit-task-${task.id}`}
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                              
                              <div className="task-meta">
                                {task.category && (
                                  <span 
                                    className="task-category" 
                                    style={{ background: `${getCategoryColor(task.category)}20`, color: getCategoryColor(task.category) }}
                                    data-testid={`task-category-${task.id}`}
                                  >
                                    {CATEGORIES.find(c => c.value === task.category)?.label}
                                  </span>
                                )}
                                {task.due_date && (
                                  <span 
                                    className={`task-due-date ${isOverdue(task.due_date) ? 'overdue' : ''}`}
                                    data-testid={`task-due-date-${task.id}`}
                                  >
                                    {isOverdue(task.due_date) && <AlertCircle size={12} />}
                                    <Calendar size={12} />
                                    {format(new Date(task.due_date), "MMM d")}
                                  </span>
                                )}
                                {progress && (
                                  <span className="subtask-progress" data-testid={`subtask-progress-${task.id}`}>
                                    <CheckCircle2 size={12} />
                                    {progress.completed}/{progress.total}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="task-actions">
                          {(task.subtasks && task.subtasks.length > 0) || isExpanded ? (
                            <button
                              onClick={() => toggleTaskExpanded(task.id)}
                              className="expand-button"
                              data-testid={`expand-task-${task.id}`}
                            >
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleTaskExpanded(task.id)}
                              className="add-subtask-button"
                              data-testid={`add-subtask-btn-${task.id}`}
                              title="Add subtask"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                          
                          <Select value={task.priority} onValueChange={(v) => updateTaskPriority(task.id, v)}>
                            <SelectTrigger className="priority-badge" data-testid={`task-priority-select-${task.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">🔴 High</SelectItem>
                              <SelectItem value="medium">🟡 Medium</SelectItem>
                              <SelectItem value="low">🟢 Low</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="delete-button"
                            data-testid={`delete-task-${task.id}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="subtasks-section" data-testid={`subtasks-section-${task.id}`}>
                          <div className="subtasks-list">
                            {task.subtasks && task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="subtask-item" data-testid={`subtask-${subtask.id}`}>
                                <Checkbox
                                  checked={subtask.completed}
                                  onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
                                  className="subtask-checkbox"
                                  data-testid={`subtask-checkbox-${subtask.id}`}
                                />
                                <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
                                  {subtask.text}
                                </span>
                                <button
                                  onClick={() => deleteSubtask(task.id, subtask.id)}
                                  className="subtask-delete"
                                  data-testid={`delete-subtask-${subtask.id}`}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="add-subtask-input">
                            <input
                              type="text"
                              value={newSubtaskText[task.id] || ""}
                              onChange={(e) => setNewSubtaskText({ ...newSubtaskText, [task.id]: e.target.value })}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') addSubtask(task.id);
                              }}
                              placeholder="Add a subtask..."
                              className="subtask-input"
                              data-testid={`subtask-input-${task.id}`}
                            />
                            <button
                              onClick={() => addSubtask(task.id)}
                              className="subtask-add-btn"
                              data-testid={`add-subtask-${task.id}`}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="footer-stats" data-testid="task-stats">
              <span>{activeCount} active</span>
              <span>•</span>
              <span>{completedCount} completed</span>
              <span>•</span>
              <span>{tasks.length} total</span>
            </div>
          )}
        </div>

        {/* Contact Footer */}
        <footer className="contact-footer">
          <div className="footer-content">
            <div className="footer-text">
              <p className="footer-title">Let's Connect!</p>
              <p className="footer-subtitle">Feel free to reach out or check out my work</p>
            </div>
            <div className="footer-links">
              <a 
                href="https://www.linkedin.com/in/kartik-s-rathod-a98364389/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link linkedin"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://github.com/kartiksrathod" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link github"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 Kartik S Rathod • Built with React & FastAPI</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;