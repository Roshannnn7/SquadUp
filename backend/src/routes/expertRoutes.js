import express from 'express';
import { authenticate, checkRole } from '../middleware/auth.js';
import {
    getAllExperts,
    getExpertById,
    createExpertProfile,
    updateExpertProfile,
} from '../controllers/expertController.js';

const router = express.Router();

/**
 * @route   GET /api/experts
 * @desc    Get all experts
 * @access  Public
 */
router.get('/', getAllExperts);

/**
 * @route   GET /api/experts/:id
 * @desc    Get expert by ID
 * @access  Public
 */
router.get('/:id', getExpertById);

/**
 * @route   POST /api/experts
 * @desc    Create expert profile
 * @access  Private
 */
router.post('/', authenticate, createExpertProfile);

/**
 * @route   PUT /api/experts/:id
 * @desc    Update expert profile
 * @access  Private (Expert or Admin)
 */
router.put('/:id', authenticate, updateExpertProfile);

export default router;
