import express from 'express';
import { authenticate, checkRole } from '../middleware/auth.js';
import {
    getStats,
    getAllUsers,
    deleteUser,
    toggleUserStatus,
} from '../controllers/adminController.js';
import { getAllBookings } from '../controllers/bookingController.js';

const router = express.Router();

// All routes require admin role
router.use(authenticate);
router.use(checkRole(['admin']));

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform statistics
 * @access  Private/Admin
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination
 * @access  Private/Admin
 */
router.get('/users', getAllUsers);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/users/:id', deleteUser);

/**
 * @route   PUT /api/admin/users/:id/toggle-status
 * @desc    Toggle user active status
 * @access  Private/Admin
 */
router.put('/users/:id/toggle-status', toggleUserStatus);

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings
 * @access  Private/Admin
 */
router.get('/bookings', getAllBookings);

export default router;
