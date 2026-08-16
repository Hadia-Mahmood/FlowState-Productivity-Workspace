import React, { useState, useEffect } from 'react';

export default function Navbar({ onNewProjectClick, activeView, setActiveView, currentProject }) {
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(() => setServerStatus({ status: 'offline', aiEngine: 'Offline' }));
  }, []);

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={() => setActiveView('dashboard')}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <span className="brand-name">Flow<span className="gradient-text">State</span></span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </button>
          {currentProject && (
            <button 
              className={`nav-btn ${activeView === 'focus' ? 'active' : ''}`}
              onClick={() => setActiveView('focus')}
            >
              <span className="live-dot"></span> Focus Mode
            </button>
          )}
        </nav>

        <div className="nav-actions">
          <div className="status-badge" title={serverStatus ? `Database: ${serverStatus.database}` : 'Checking server status...'}>
            <span className={`status-dot ${serverStatus?.status === 'online' ? 'online' : 'offline'}`}></span>
            <span className="status-text">{serverStatus?.aiEngine || 'Connecting...'}</span>
          </div>

          <button className="btn-primary" onClick={onNewProjectClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Decompose Goal
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          background: rgba(10, 12, 22, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0.75rem 1.5rem;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .logo-icon {
          background: var(--gradient-main);
          padding: 8px;
          border-radius: var(--radius-sm);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
        }

        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .nav-links {
          display: flex;
          gap: 0.5rem;
        }

        .nav-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 0.5rem 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .nav-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-btn.active {
          color: var(--accent-cyan);
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-pink);
          border-radius: 50%;
          display: inline-block;
          animation: pulseGlow 1.5s infinite;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          font-size: 0.8rem;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .status-dot.online {
          background: var(--accent-emerald);
          box-shadow: 0 0 8px var(--accent-emerald);
        }

        .status-dot.offline {
          background: var(--accent-amber);
        }

        .status-text {
          color: var(--text-muted);
        }
      `}</style>
    </header>
  );
}
