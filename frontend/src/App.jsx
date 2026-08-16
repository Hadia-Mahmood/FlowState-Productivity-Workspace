import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectInputModal from './components/ProjectInputModal';
import TaskTree from './components/TaskTree';
import FocusMode from './components/FocusMode';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'focus'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/projects');
      const data = await res.json();
      if (data.success && data.data) {
        setProjects(data.data);
        if (data.data.length > 0 && !currentProject) {
          setCurrentProject(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setActiveView('dashboard');
  };

  const handleUpdateTaskStatus = async (projectId, taskId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentProject(data.data);
        setProjects(projects.map(p => p._id === projectId ? data.data : p));
      }
    } catch (err) {
      console.error('Error updating task status', err);
    }
  };

  const handleAddTask = async (projectId, taskData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentProject(data.data);
        setProjects(projects.map(p => p._id === projectId ? data.data : p));
      }
    } catch (err) {
      console.error('Error adding task', err);
    }
  };

  const handleStartFocusMode = (task) => {
    setActiveTask(task);
    setActiveView('focus');
  };

  return (
    <div className="app-container">
      <Navbar 
        onNewProjectClick={() => setIsModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        currentProject={currentProject}
      />

      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Initializing FlowState Workspace...</p>
          </div>
        ) : activeView === 'focus' && activeTask && currentProject ? (
          <FocusMode 
            task={activeTask}
            project={currentProject}
            onCompleteTask={handleUpdateTaskStatus}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        ) : (
          <div className="dashboard-layout">
            {/* Sidebar: Projects Selector */}
            <aside className="sidebar-projects glass-card">
              <div className="sidebar-header">
                <h3>Projects</h3>
                <button className="icon-add-btn" onClick={() => setIsModalOpen(true)} title="New Goal">+ New</button>
              </div>

              <div className="projects-list">
                {projects.map(p => (
                  <div 
                    key={p._id}
                    className={`project-item ${currentProject?._id === p._id ? 'active' : ''}`}
                    onClick={() => setCurrentProject(p)}
                  >
                    <span className="p-title">{p.title}</span>
                    <span className="p-badge">{p.tasks?.length || 0} tasks</span>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="empty-projects">
                    No active projects. Click "Decompose Goal" to generate your first AI workspace!
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content Area: Current Project Task Tree */}
            <section className="project-view-area">
              {currentProject ? (
                <TaskTree 
                  project={currentProject}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onStartFocusMode={handleStartFocusMode}
                  onAddTask={handleAddTask}
                />
              ) : (
                <div className="empty-dashboard glass-card">
                  <h2>Welcome to FlowState AI</h2>
                  <p>Eliminate cognitive fatigue and task paralysis. Create your first goal to let AI structure your workspace.</p>
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: '1rem' }}>
                    Decompose Your First Goal &rarr;
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <ProjectInputModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <style>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
          color: var(--text-muted);
        }

        .spinner-large {
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 860px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }
        }

        .sidebar-projects {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.75rem;
        }

        .sidebar-header h3 {
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .icon-add-btn {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: var(--accent-primary);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .project-item {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all var(--transition-fast);
        }

        .project-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .project-item.active {
          background: rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .p-title {
          font-size: 0.9rem;
          color: var(--text-main);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 170px;
        }

        .p-badge {
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        .empty-projects {
          color: var(--text-dim);
          font-size: 0.85rem;
          padding: 1rem 0.5rem;
          line-height: 1.4;
        }

        .empty-dashboard {
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-dashboard h2 {
          font-size: 2rem;
          color: var(--text-main);
        }

        .empty-dashboard p {
          color: var(--text-muted);
          max-width: 500px;
        }
      `}</style>
    </div>
  );
}
