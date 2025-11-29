import React from 'react';

const Statistics = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const activeTasks = tasks.filter(task => task.status === 'active');
  const overdueTasks = activeTasks.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return due < new Date();
  });

  const totalExpectedDays = tasks.reduce((sum, task) => sum + task.expectedDays, 0);
  const totalDaysSpent = tasks.reduce((sum, task) => sum + task.daysSpent, 0);
  
  const timeSaved = completedTasks.reduce((sum, task) => {
    const difference = task.expectedDays - task.daysSpent;
    return difference > 0 ? sum + difference : sum;
  }, 0);

  const formatDays = (days) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  const getProductivityScore = () => {
    if (completedTasks.length === 0) return 0;
    const totalEfficiency = completedTasks.reduce((sum, task) => {
      const efficiency = task.expectedDays > 0 ? (task.daysSpent / task.expectedDays) : 1;
      return sum + Math.min(1, efficiency);
    }, 0);
    return Math.round((totalEfficiency / completedTasks.length) * 100);
  };

  const getLongestActiveTask = () => {
    if (activeTasks.length === 0) return null;
    return activeTasks.reduce((longest, task) => 
      task.daysSpent > longest.daysSpent ? task : longest
    );
  };

  const longestTask = getLongestActiveTask();

  return (
    <div className="card">
      <h2>Your Progress Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedTasks.length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeTasks.length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overdueTasks.length}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: '15px' }}>
        <div className="stat-card">
          <div className="stat-value">{getProductivityScore()}%</div>
          <div className="stat-label">Efficiency Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatDays(timeSaved)}</div>
          <div className="stat-label">Time Saved</div>
        </div>
      </div>

      <div className="progress-container" style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Time Invested: {formatDays(totalDaysSpent)}</span>
          <span>Planned: {formatDays(totalExpectedDays)}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${totalExpectedDays > 0 ? Math.min(100, (totalDaysSpent / totalExpectedDays) * 100) : 0}%` 
            }}
          ></div>
        </div>
      </div>

      {longestTask && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px',
          marginTop: '15px'
        }}>
          <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>Longest Running Project</h4>
          <div style={{ fontWeight: '600' }}>{longestTask.name}</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            {formatDays(longestTask.daysSpent)} spent • {formatDays(longestTask.expectedDays)} expected
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          padding: '15px', 
          borderRadius: '8px',
          marginTop: '15px'
        }}>
          <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>🎉 Completion Rate</h4>
          <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2e7d32' }}>
            {Math.round((completedTasks.length / tasks.length) * 100)}% of projects completed
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;