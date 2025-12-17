import express from 'express';
import { authenticate, checkRole } from '../middleware/auth.js';
import {
    getUserProfile,
    updateUserProfile,
    createUser,
    getAllUsers,
    getPublicUsers,
} from '../controllers/userController.js';

const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Create new user (after Firebase signup)
 * @access  Public
 */
router.post('/', createUser);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, updateUserProfile);

/**
 * @route   GET /api/users/public
 * @desc    Get users for chat
 * @access  Private
 */
router.get('/public', authenticate, getPublicUsers);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/', authenticate, checkRole(['admin']), getAllUsers);

export default router;
