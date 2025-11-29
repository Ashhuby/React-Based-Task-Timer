import React, { useState, useEffect } from 'react';

const Timer = ({ task, onTimeUpdate, onComplete }) => {
  const [daysSpent, setDaysSpent] = useState(task.daysSpent || 0);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Check if a day has passed since last update
  useEffect(() => {
    const checkDayCompletion = () => {
      const now = new Date();
      const today = now.toDateString();
      
      // If we haven't updated today, and it's a new day
      if (lastUpdated !== today) {
        // Check if it's been more than 24 hours since creation/start
        const taskDate = new Date(task.createdAt);
        const daysSinceCreation = Math.floor((now - taskDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCreation > daysSpent) {
          const newDays = daysSinceCreation;
          setDaysSpent(newDays);
          onTimeUpdate(task.id, newDays);
          setLastUpdated(today);
        }
      }
    };

    // Check daily
    const interval = setInterval(checkDayCompletion, 60 * 60 * 1000); // Check every hour
    checkDayCompletion(); // Initial check

    return () => clearInterval(interval);
  }, [task.id, task.createdAt, daysSpent, lastUpdated, onTimeUpdate]);

  const manuallyAddDay = () => {
    const newDays = daysSpent + 1;
    setDaysSpent(newDays);
    onTimeUpdate(task.id, newDays);
    setLastUpdated(new Date().toDateString());
  };

  const manuallyRemoveDay = () => {
    if (daysSpent > 0) {
      const newDays = daysSpent - 1;
      setDaysSpent(newDays);
      onTimeUpdate(task.id, newDays);
      setLastUpdated(new Date().toDateString());
    }
  };

  const formatDays = (days) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  const getProgressMessage = () => {
    const progress = (daysSpent / task.expectedDays) * 100;
    
    if (progress === 0) return "Just started!";
    if (progress < 25) return "Getting started";
    if (progress < 50) return "Making progress";
    if (progress < 75) return "Halfway there!";
    if (progress < 100) return "Almost done!";
    return "Time target reached!";
  };

  return (
    <div className="timer-container">
      <div className="time-tracker">
        <div className="time-display">
          <div className="days-count">{daysSpent} days</div>
          <div className="progress-message">{getProgressMessage()}</div>
        </div>
        
        <div className="progress-container" style={{ margin: '15px 0' }}>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(100, (daysSpent / task.expectedDays) * 100)}%` 
              }}
            ></div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.9rem',
            color: '#666',
            marginTop: '5px'
          }}>
            <span>Started</span>
            <span>{formatDays(task.expectedDays)} goal</span>
          </div>
        </div>

        <div className="time-actions">
          <button 
            className="btn btn-success" 
            onClick={manuallyAddDay}
            style={{ flex: 1 }}
          >
            +1 Day
          </button>
          <button 
            className="btn btn-warning" 
            onClick={manuallyRemoveDay}
            disabled={daysSpent === 0}
            style={{ flex: 1 }}
          >
            -1 Day
          </button>
        </div>

        <div style={{ 
          fontSize: '0.8rem', 
          color: '#666', 
          textAlign: 'center',
          marginTop: '10px'
        }}>
          Time automatically tracks daily, or manually adjust
        </div>
      </div>
    </div>
  );
};

export default Timer;