import React, { useState } from 'react';

export default function ProjectInputModal({ isOpen, onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category })
      });

      const data = await res.json();
      if (data.success) {
        onProjectCreated(data.data);
        setTitle('');
        setDescription('');
        onClose();
      } else {
        setError(data.message || 'Failed to decompose goal with AI.');
      }
    } catch (err) {
      setError('Server connection error. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { title: 'Launch Modern SaaS Product', category: 'Software Engineering', desc: 'Build a full-stack web application with user auth, billing, and responsive dashboard.' },
    { title: 'Redesign Brand UI & Design System', category: 'UI/UX Design', desc: 'Craft a new dark-mode design system with glassmorphism tokens and core visual components.' },
    { title: 'Write Q3 Technical Roadmap', category: 'Product Strategy', desc: 'Research engineering constraints, prioritize feature backlog, and draft milestone goals.' }
  ];

  const handleUsePrompt = (prompt) => {
    setTitle(prompt.title);
    setCategory(prompt.category);
    setDescription(prompt.desc);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in">
        <div className="modal-header">
          <div>
            <h2>AI Goal Decomposition</h2>
            <p className="modal-subtitle">Enter your goal below. FlowState AI will analyze cognitive load, create milestones, and extract context briefs.</p>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Goal Title</label>
            <input 
              type="text" 
              placeholder="e.g. Build Realtime AI Productivity Workspace" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Domain / Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Software Engineering">Software Engineering</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Product Strategy">Product Strategy</option>
              <option value="Research & Writing">Research & Writing</option>
              <option value="General Productivity">General Productivity</option>
            </select>
          </div>

          <div className="form-group">
            <label>Detailed Goal Description</label>
            <textarea 
              rows="4" 
              placeholder="Provide background info, desired outcome, or key technologies to include..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="sample-prompts">
            <span className="sample-label">Quick Ideas:</span>
            <div className="prompt-chips">
              {samplePrompts.map((p, idx) => (
                <button type="button" key={idx} className="prompt-chip" onClick={() => handleUsePrompt(p)}>
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Decomposing via AI...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Generate Cognitive Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 7, 15, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1.5rem;
        }

        .modal-content {
          width: 100%;
          max-width: 600px;
          padding: 2rem;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border-glow);
          box-shadow: var(--shadow-glow);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          color: var(--text-main);
        }

        .modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.8rem;
          cursor: pointer;
          line-height: 1;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .form-group input, .form-group select, .form-group textarea {
          background: rgba(10, 12, 22, 0.6);
          border: 1px solid var(--glass-border);
          color: var(--text-main);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
        }

        .sample-prompts {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .sample-label {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .prompt-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .prompt-chip {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 0.35rem 0.75rem;
          border-radius: 16px;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .prompt-chip:hover {
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-cyan);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
