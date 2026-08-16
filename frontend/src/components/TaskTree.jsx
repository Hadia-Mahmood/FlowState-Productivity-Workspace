import React, { useState } from 'react';

export default function TaskTree({ project, onUpdateTaskStatus, onStartFocusMode, onAddTask }) {
  const [newTitle, setNewTitle] = useState('');
  const [newMilestone, setNewMilestone] = useState(project.aiAnalysis?.suggestedPhases?.[0] || 'General');
  const [showAddTask, setShowAddTask] = useState(false);

  const completedCount = project.tasks.filter(t => t.status === 'completed').length;
  const progressPct = project.tasks.length ? Math.round((completedCount / project.tasks.length) * 100) : 0;

  // Group tasks by milestone
  const milestones = project.aiAnalysis?.suggestedPhases?.length > 0 
    ? project.aiAnalysis.suggestedPhases 
    : ['General'];

  const groupedTasks = {};
  milestones.forEach(m => groupedTasks[m] = []);
  
  project.tasks.forEach(t => {
    const key = t.milestone || 'General';
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(t);
  });

  const handleAddNewTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(project._id, {
      title: newTitle,
      milestone: newMilestone,
      priority: 'Medium',
      estimatedMinutes: 30
    });
    setNewTitle('');
    setShowAddTask(false);
  };

  return (
    <div className="task-tree-container">
      {/* Project Banner & AI Summary */}
      <div className="project-banner glass-card">
        <div className="banner-main">
          <div>
            <span className="project-category">{project.category}</span>
            <h1 className="project-title">{project.title}</h1>
            <p className="project-desc">{project.description}</p>
          </div>

          <div className="banner-stats">
            <div className="stat-pill">
              <span className="stat-label">Cognitive Complexity</span>
              <span className="stat-val gradient-text">{project.aiAnalysis?.complexityScore || 5}/10</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Tasks Done</span>
              <span className="stat-val">{completedCount}/{project.tasks.length} ({progressPct}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
        </div>

        {/* AI Insight Box */}
        {project.aiAnalysis?.summary && (
          <div className="ai-insight-box">
            <div className="ai-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div>
              <span className="ai-insight-title">AI Execution Briefing</span>
              <p className="ai-insight-text">{project.aiAnalysis.summary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Task Milestones & Grouping */}
      <div className="milestones-section">
        <div className="section-header">
          <h2>Milestones & Execution Plan</h2>
          <button className="btn-secondary" onClick={() => setShowAddTask(!showAddTask)}>
            + Add Task
          </button>
        </div>

        {showAddTask && (
          <form onSubmit={handleAddNewTaskSubmit} className="add-task-form glass-card animate-fade-in">
            <input 
              type="text" 
              placeholder="Task Title..." 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)}
              required 
            />
            <select value={newMilestone} onChange={e => setNewMilestone(e.target.value)}>
              {milestones.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary">Add Task</button>
          </form>
        )}

        {Object.entries(groupedTasks).map(([milestone, tasks], idx) => (
          <div key={idx} className="milestone-block">
            <h3 className="milestone-title">
              <span className="milestone-dot"></span>
              {milestone}
              <span className="task-count-badge">{tasks.length} tasks</span>
            </h3>

            <div className="tasks-grid">
              {tasks.map(task => (
                <div key={task._id} className={`task-card glass-card ${task.status}`}>
                  <div className="task-card-header">
                    <button 
                      className={`check-circle ${task.status}`}
                      onClick={() => onUpdateTaskStatus(project._id, task._id, task.status === 'completed' ? 'todo' : 'completed')}
                      title="Toggle completion status"
                    >
                      {task.status === 'completed' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      )}
                    </button>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </div>

                  <h4 className={`task-card-title ${task.status === 'completed' ? 'completed-text' : ''}`}>
                    {task.title}
                  </h4>
                  <p className="task-card-desc">{task.description}</p>

                  <div className="task-card-footer">
                    <span className="est-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {task.estimatedMinutes}m
                    </span>

                    <button 
                      className="focus-launch-btn"
                      onClick={() => onStartFocusMode(task)}
                      title="Launch into Distraction-Free Focus Mode"
                    >
                      Focus State &rarr;
                    </button>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="empty-milestone">No tasks created under this milestone yet.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .task-tree-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .project-banner {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: linear-gradient(135deg, rgba(18, 22, 41, 0.9) 0%, rgba(26, 32, 59, 0.8) 100%);
        }

        .banner-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .project-category {
          color: var(--accent-cyan);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .project-title {
          font-size: 2rem;
          color: var(--text-main);
          margin: 0.2rem 0 0.5rem 0;
        }

        .project-desc {
          color: var(--text-muted);
          max-width: 700px;
          font-size: 1rem;
        }

        .banner-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-pill {
          background: rgba(10, 12, 22, 0.5);
          border: 1px solid var(--glass-border);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .stat-val {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-main);
        }

        .progress-bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--gradient-main);
          transition: width 0.4s ease;
        }

        .ai-insight-box {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.2);
          padding: 1rem;
          border-radius: var(--radius-sm);
        }

        .ai-icon {
          color: var(--accent-primary);
          margin-top: 2px;
        }

        .ai-insight-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-primary);
          display: block;
          margin-bottom: 0.2rem;
        }

        .ai-insight-text {
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .milestones-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h2 {
          font-size: 1.35rem;
          color: var(--text-main);
        }

        .add-task-form {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .add-task-form input {
          flex: 1;
          background: rgba(10, 12, 22, 0.6);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          outline: none;
        }

        .add-task-form select {
          background: rgba(10, 12, 22, 0.6);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
        }

        .milestone-block {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .milestone-title {
          font-size: 1.1rem;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .milestone-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan);
        }

        .task-count-badge {
          font-size: 0.75rem;
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-weight: normal;
        }

        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }

        .task-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(18, 22, 41, 0.6);
        }

        .task-card.completed {
          opacity: 0.6;
          border-color: rgba(16, 185, 129, 0.2);
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .check-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid var(--text-muted);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all var(--transition-fast);
        }

        .check-circle.completed {
          background: var(--accent-emerald);
          border-color: var(--accent-emerald);
        }

        .task-card-title {
          font-size: 1.05rem;
          color: var(--text-main);
          font-weight: 600;
        }

        .task-card-title.completed-text {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-card-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.4;
          flex: 1;
        }

        .task-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 0.75rem;
          margin-top: 0.25rem;
        }

        .est-time {
          font-size: 0.8rem;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .focus-launch-btn {
          background: transparent;
          border: none;
          color: var(--accent-cyan);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .focus-launch-btn:hover {
          color: var(--accent-pink);
        }

        .empty-milestone {
          color: var(--text-dim);
          font-size: 0.85rem;
          font-style: italic;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
