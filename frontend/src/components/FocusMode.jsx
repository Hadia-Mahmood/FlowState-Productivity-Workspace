import React, { useState, useEffect } from 'react';

export default function FocusMode({ task, project, onCompleteTask, onBackToDashboard }) {
  const [secondsLeft, setSecondsLeft] = useState((task?.estimatedMinutes || 30) * 60);
  const [isActive, setIsActive] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft((task?.estimatedMinutes || 30) * 60);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const briefing = task?.aiBriefing || {
    contextSummary: `Maintain high cognitive focus for ${task.title}. Eliminate background notifications.`,
    keyDeliverables: ['Primary task objective draft', 'Quality verification'],
    suggestedTools: ['FlowState Timer', 'Workspace Editor'],
    potentialPitfalls: ['Context switching and premature optimization']
  };

  return (
    <div className="focus-mode-container animate-fade-in">
      {/* Top Header Controls */}
      <div className="focus-header">
        <button className="btn-secondary" onClick={onBackToDashboard}>
          &larr; Back to Task Tree
        </button>
        <div className="focus-project-tag">
          <span className="dot"></span> {project.title} &bull; {task.milestone}
        </div>
      </div>

      <div className="focus-grid">
        {/* Left Column: Active Task & Timer */}
        <div className="focus-main glass-card">
          <div className="task-header-badge">
            <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority} Priority</span>
            <span className="status-indicator">{task.status}</span>
          </div>

          <h1 className="focus-task-title">{task.title}</h1>
          <p className="focus-task-desc">{task.description}</p>

          {/* Timer Widget */}
          <div className="timer-widget">
            <div className="timer-display">{formatTime(secondsLeft)}</div>
            <div className="timer-controls">
              <button className="btn-primary timer-btn" onClick={toggleTimer}>
                {isActive ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    Pause State
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Enter Flow State
                  </>
                )}
              </button>
              <button className="btn-secondary" onClick={resetTimer}>Reset</button>
            </div>
          </div>

          {/* Quick Execution Notes */}
          <div className="notes-section">
            <label>Scratchpad / Focus Notes</label>
            <textarea 
              rows="4" 
              placeholder="Record temporary thoughts, code snippets, or key findings during this focus session..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="complete-action">
            <button 
              className="btn-primary complete-btn"
              onClick={() => {
                onCompleteTask(project._id, task._id);
                onBackToDashboard();
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Mark Task Completed
            </button>
          </div>
        </div>

        {/* Right Column: AI Context Briefing */}
        <div className="focus-sidebar glass-card">
          <div className="sidebar-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Cognitive Context Briefing
          </div>

          <div className="briefing-block">
            <h4>Objective Context</h4>
            <p>{briefing.contextSummary}</p>
          </div>

          <div className="briefing-block">
            <h4>Key Deliverables</h4>
            <ul>
              {briefing.keyDeliverables?.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="briefing-block">
            <h4>Suggested Stack / Tools</h4>
            <div className="tool-tags">
              {briefing.suggestedTools?.map((t, i) => (
                <span key={i} className="tool-tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="briefing-block pitfall-block">
            <h4>Potential Obstacles to Avoid</h4>
            <ul>
              {briefing.potentialPitfalls?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .focus-mode-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .focus-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .focus-project-tag {
          font-size: 0.9rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .focus-project-tag .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-pink);
        }

        .focus-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .focus-grid {
            grid-template-columns: 1fr;
          }
        }

        .focus-main {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: linear-gradient(135deg, rgba(18, 22, 41, 0.9) 0%, rgba(26, 32, 59, 0.95) 100%);
        }

        .task-header-badge {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .status-indicator {
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .focus-task-title {
          font-size: 2.2rem;
          color: var(--text-main);
          line-height: 1.2;
        }

        .focus-task-desc {
          color: var(--text-muted);
          font-size: 1.05rem;
        }

        .timer-widget {
          background: rgba(10, 12, 22, 0.6);
          border: 1px solid var(--glass-border-glow);
          border-radius: var(--radius-md);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.1);
        }

        .timer-display {
          font-family: var(--font-heading);
          font-size: 4.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          background: var(--gradient-focus);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .timer-controls {
          display: flex;
          gap: 1rem;
        }

        .timer-btn {
          padding: 0.85rem 2rem;
          font-size: 1.05rem;
        }

        .notes-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .notes-section label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .notes-section textarea {
          background: rgba(10, 12, 22, 0.6);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          padding: 1rem;
          border-radius: var(--radius-sm);
          outline: none;
          font-family: var(--font-body);
          resize: vertical;
        }

        .complete-btn {
          width: 100%;
          justify-content: center;
          padding: 1rem;
          font-size: 1.05rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .complete-btn:hover {
          box-shadow: 0 6px 22px rgba(16, 185, 129, 0.5);
        }

        .focus-sidebar {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: rgba(18, 22, 41, 0.7);
        }

        .sidebar-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.75rem;
        }

        .briefing-block h4 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-dim);
          margin-bottom: 0.4rem;
        }

        .briefing-block p {
          font-size: 0.9rem;
          color: var(--text-main);
          line-height: 1.5;
        }

        .briefing-block ul {
          padding-left: 1.2rem;
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .briefing-block li {
          margin-bottom: 0.3rem;
        }

        .tool-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tool-tag {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
          color: var(--accent-cyan);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-size: 0.78rem;
        }

        .pitfall-block {
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.2);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
        }

        .pitfall-block h4 {
          color: var(--accent-amber);
        }
      `}</style>
    </div>
  );
}
