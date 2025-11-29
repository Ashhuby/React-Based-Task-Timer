import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Statistics from './components/Statistics';

function App() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem('focusTimeTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('focusTimeTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleTimeUpdate = (taskId, daysSpent) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, daysSpent } : task
    ));
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        status: task.status === 'active' ? 'completed' : 'active',
        completedAt: task.status === 'active' ? new Date().toISOString() : null
      } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="container">
      <header>
        <h1>FocusTime</h1>
        <p className="tagline">Track your long-term tasks and projects</p>
      </header>
      
      <div className="app-container">
        <div>
          <TaskForm onAddTask={handleAddTask} />
          <Statistics tasks={tasks} />
        </div>
        
        <div className="card">
          <h2>Your Tasks & Projects</h2>
          {tasks.length === 0 ? (
            <div className="empty-state">
              <EmptyStateIcon />
              <h3>No tasks yet</h3>
              <p>Add your first task or project to get started!</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  onTimeUpdate={handleTimeUpdate}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// SVG icon for empty state
const EmptyStateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default App;