const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// GET all projects
router.get('/', projectController.getProjects);

// GET project by ID
router.get('/:id', projectController.getProjectById);

// POST create project with AI decomposition
router.post('/', projectController.createProject);

// PATCH update task status inside a project
router.patch('/:projectId/tasks/:taskId/status', projectController.updateTaskStatus);

// POST add task to a project
router.post('/:projectId/tasks', projectController.addTask);

// DELETE project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
