const Project = require('../models/Project');
const aiService = require('../services/aiService');

// In-memory fallback database for instant local execution without external DB dependencies
let memoryProjects = [];

const projectController = {
  /**
   * Get all projects
   */
  async getProjects(req, res, next) {
    try {
      if (req.isDbConnected) {
        const projects = await Project.find().sort({ updatedAt: -1 });
        return res.json({ success: true, data: projects });
      } else {
        return res.json({ success: true, data: memoryProjects });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get project by ID
   */
  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      if (req.isDbConnected) {
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        return res.json({ success: true, data: project });
      } else {
        const project = memoryProjects.find(p => p._id === id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        return res.json({ success: true, data: project });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new project with AI Decomposition
   */
  async createProject(req, res, next) {
    try {
      const { title, description, category } = req.body;

      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Title and description are required' });
      }

      // Run AI Decomposition Pipeline
      console.log(`[AI Compute] Initiating goal decomposition for: "${title}"`);
      const aiResult = await aiService.decomposeGoal(title, description);

      const projectData = {
        title,
        description,
        category: category || 'Productivity',
        aiAnalysis: {
          summary: aiResult.summary,
          suggestedPhases: aiResult.suggestedPhases,
          complexityScore: aiResult.complexityScore,
          cognitiveLoadScore: aiResult.cognitiveLoadScore
        },
        tasks: aiResult.tasks || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (req.isDbConnected) {
        const project = await Project.create(projectData);
        return res.status(201).json({ success: true, data: project });
      } else {
        const newProject = {
          _id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          ...projectData,
          tasks: projectData.tasks.map((t, idx) => ({
            _id: 'task_' + Date.now() + '_' + idx,
            ...t,
            status: t.status || 'todo',
            createdAt: new Date()
          }))
        };
        memoryProjects.unshift(newProject);
        return res.status(201).json({ success: true, data: newProject });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Task Status
   */
  async updateTaskStatus(req, res, next) {
    try {
      const { projectId, taskId } = req.params;
      const { status } = req.body;

      if (!['todo', 'in-progress', 'completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid task status' });
      }

      if (req.isDbConnected) {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const task = project.tasks.id(taskId);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        task.status = status;
        project.updatedAt = new Date();
        await project.save();
        return res.json({ success: true, data: project });
      } else {
        const project = memoryProjects.find(p => p._id === projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const task = project.tasks.find(t => t._id === taskId);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        task.status = status;
        project.updatedAt = new Date();
        return res.json({ success: true, data: project });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add Custom Task to Project
   */
  async addTask(req, res, next) {
    try {
      const { projectId } = req.params;
      const { title, description, milestone, priority, estimatedMinutes } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: 'Task title is required' });
      }

      // Generate AI briefing for custom task
      const briefing = await aiService.generateTaskBriefing(title, description || title);

      const newTask = {
        title,
        description: description || '',
        milestone: milestone || 'General',
        priority: priority || 'Medium',
        estimatedMinutes: estimatedMinutes || 30,
        status: 'todo',
        aiBriefing: briefing,
        createdAt: new Date()
      };

      if (req.isDbConnected) {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        project.tasks.push(newTask);
        project.updatedAt = new Date();
        await project.save();
        return res.status(201).json({ success: true, data: project });
      } else {
        const project = memoryProjects.find(p => p._id === projectId);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const taskObj = {
          _id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          ...newTask
        };
        project.tasks.push(taskObj);
        project.updatedAt = new Date();
        return res.status(201).json({ success: true, data: project });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete Project
   */
  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      if (req.isDbConnected) {
        await Project.findByIdAndDelete(id);
      } else {
        memoryProjects = memoryProjects.filter(p => p._id !== id);
      }
      return res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = projectController;
