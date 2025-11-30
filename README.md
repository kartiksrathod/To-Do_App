# 📝 Advanced To-Do List Application

A modern, feature-rich task management application built with React and localStorage. Organize your tasks efficiently with priorities, categories, due dates, and subtasks - all stored locally in your browser.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.x-blue)
![localStorage](https://img.shields.io/badge/Storage-localStorage-orange)

## ✨ Features

### 🎯 Core Functionality
- ✅ **Task Management** - Create, edit, delete, and organize tasks
- 🔄 **Drag & Drop** - Reorder tasks with intuitive drag-and-drop
- ✔️ **Subtasks** - Break down complex tasks into manageable subtasks
- 🎨 **Categories** - Organize tasks by Work, Personal, Shopping, Health, and more
- 📅 **Due Dates** - Set deadlines and track overdue tasks
- ⚡ **Priority Levels** - Mark tasks as High, Medium, or Low priority

### 🎨 User Experience
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 🔍 **Search & Filter** - Quick search and filter by status (All, Active, Completed)
- 📊 **Progress Tracking** - Visual progress indicators for subtasks
- 💾 **Auto-Save** - Tasks persist automatically in your browser
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

### 🚀 Advanced Features
- ⌨️ **Keyboard Shortcuts** - Press Enter to quickly add tasks
- 🎯 **Bulk Actions** - Mark all complete or clear completed tasks
- 📈 **Task Statistics** - View active, completed, and total task counts
- 🎨 **Color-Coded** - Visual priority and category indicators

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework with latest features
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful, consistent icons
- **shadcn/ui** - High-quality component library
- **date-fns** - Date formatting and manipulation
- **Sonner** - Toast notifications

### Storage
- **localStorage** - Browser-based storage for tasks
- **Automatic persistence** - All changes saved instantly
- **No backend required** - Simple and fast

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **Yarn** - Package manager
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### 2. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install
```

## 🏃 Running the Application

```bash
cd frontend
yarn start
```

The application will automatically open in your browser at `http://localhost:3000`

That's it! No backend setup needed - everything runs in your browser.

## 📁 Project Structure

```
todo-app/
├── frontend/               # React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # UI components (shadcn/ui)
│   │   │   └── ui/       # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── App.js        # Main application component
│   │   ├── App.css       # Custom styling
│   │   └── index.js      # Entry point
│   ├── package.json      # Node dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 💾 Data Storage

All tasks are stored locally in your browser using **localStorage**:

- **Automatic Saving** - Changes are saved instantly as you work
- **Persistent Data** - Tasks remain even after closing the browser
- **Privacy** - Your data never leaves your device
- **No Internet Required** - Works completely offline

**Note:** Clearing browser data will delete your tasks. Consider exporting important tasks or using browser sync features.

## 🎮 Usage Guide

### Creating Tasks
1. Type your task in the input field
2. Select priority (High, Medium, Low)
3. Choose a category (optional)
4. Set a due date (optional)
5. Click "Add" or press Enter

### Managing Tasks
- **Complete**: Click the checkbox
- **Edit**: Click the edit icon next to the task
- **Delete**: Click the trash icon
- **Reorder**: Drag and drop tasks
- **Add Subtask**: Click the + icon or expand task

### Filters & Search
- Use the search bar to find tasks by text
- Filter by: All, Active, or Completed
- View task statistics at the bottom

### Bulk Actions
- Click the three dots menu (⋮)
- "Mark All Complete" - Complete all tasks at once
- "Clear Completed" - Remove all completed tasks

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
yarn test
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
yarn build
```

The optimized production build will be in the `frontend/build` directory.

### Backend Deployment
For production, use a production-grade ASGI server:
```bash
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev/)
- UI Components by [shadcn/ui](https://ui.shadcn.com/)
- Design inspiration from modern task management applications

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/todo-app](https://github.com/yourusername/todo-app)

---

⭐ Star this repository if you find it helpful!
