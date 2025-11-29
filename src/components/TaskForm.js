import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [expectedDays, setExpectedDays] = useState(7);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    
    onAddTask({
      id: Date.now(),
      name: taskName,
      description: description,
      expectedDays,
      daysSpent: 0,
      dueDate: dueDate || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      completedAt: null
    });

    // Reset form
    setTaskName('');
    setDescription('');
    setExpectedDays(7);
    setDueDate('');
  };

  // Calculate min date for due date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="card">
      <h2>Add New Task/Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="taskName">Task/Project Name *</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., Finish reading Frankenstein, Learn React, Build portfolio website"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about this task or project..."
            rows="3"
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expectedDays">Expected Duration (days)</label>
          <select
            id="expectedDays"
            value={expectedDays}
            onChange={(e) => setExpectedDays(parseInt(e.target.value))}
            style={{ width: '100%' }}
          >
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={7}>1 week</option>
            <option value={14}>2 weeks</option>
            <option value={30}>1 month</option>
            <option value={60}>2 months</option>
            <option value={90}>3 months</option>
            <option value={180}>6 months</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date (Optional)</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={getMinDate()}
            style={{ width: '100%' }}
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            Setting a due date helps you stay focused
          </small>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;