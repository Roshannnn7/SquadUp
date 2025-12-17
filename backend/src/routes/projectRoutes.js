import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getAllProjects,
    createProject,
    joinProject,
} from '../controllers/projectController.js';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Private
 */
router.get('/', authenticate, getAllProjects);

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/', authenticate, createProject);

/**
 * @route   PUT /api/projects/:id/join
 * @desc    Join a project
 * @access  Private
 */
router.put('/:id/join', authenticate, joinProject);

export default router;
