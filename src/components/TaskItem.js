import React, { useState } from 'react';
import Timer from './Timer';

const TaskItem = ({ task, onTimeUpdate, onComplete, onDelete }) => {
  const [showDescription, setShowDescription] = useState(false);

  const formatDays = (days) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  const getDaysUntilDue = () => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = () => {
    const daysUntilDue = getDaysUntilDue();
    if (daysUntilDue === null) return null;
    
    if (daysUntilDue < 0) {
      return { text: `Overdue by ${Math.abs(daysUntilDue)} days`, className: 'time-over' };
    } else if (daysUntilDue === 0) {
      return { text: 'Due today', className: 'time-over' };
    } else if (daysUntilDue <= 3) {
      return { text: `Due in ${daysUntilDue} days`, className: 'time-warning' };
    } else {
      return { text: `Due in ${daysUntilDue} days`, className: 'time-neutral' };
    }
  };

  const getProgressPercentage = () => {
    if (task.expectedDays === 0) return 0;
    return Math.min(100, (task.daysSpent / task.expectedDays) * 100);
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <div className="task-item">
      <div className="task-header">
        <div className="task-name">{task.name}</div>
        <div className={`task-status status-${task.status}`}>
          {task.status === 'active' ? 'In Progress' : 'Completed'}
        </div>
      </div>

      {task.description && (
        <div className="task-description">
          <button 
            onClick={() => setShowDescription(!showDescription)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6a11cb',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: 0,
              marginBottom: '10px'
            }}
          >
            {showDescription ? '▼ Hide details' : '► Show details'}
          </button>
          {showDescription && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '10px',
              fontSize: '0.9rem',
              color: '#555'
            }}>
              {task.description}
            </div>
          )}
        </div>
      )}

      <div className="progress-container" style={{ margin: '15px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span className="time-expected">
            Expected: {formatDays(task.expectedDays)}
          </span>
          <span className="time-actual">
            Spent: {formatDays(task.daysSpent)}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {dueDateStatus && (
        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
          <span className={dueDateStatus.className}>
            {dueDateStatus.text}
          </span>
        </div>
      )}

      {task.status === 'active' && (
        <Timer 
          task={task} 
          onTimeUpdate={onTimeUpdate}
          onComplete={onComplete}
        />
      )}
      
      <div className="task-actions">
        {task.status === 'active' ? (
          <button 
            className="btn btn-primary" 
            onClick={() => onComplete(task.id)}
          >
            Mark Complete
          </button>
        ) : (
          <button 
            className="btn btn-warning" 
            onClick={() => onComplete(task.id)}
          >
            Reopen Task
          </button>
        )}
        <button 
          className="btn btn-danger" 
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>

      {task.completedAt && task.status === 'completed' && (
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#666', 
          marginTop: '10px',
          textAlign: 'center'
        }}>
          Completed on {new Date(task.completedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default TaskItem;