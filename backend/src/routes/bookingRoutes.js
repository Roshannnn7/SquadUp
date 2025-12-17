import express from 'express';
import { authenticate, checkRole } from '../middleware/auth.js';
import {
    createBooking,
    getUserBookings,
    getExpertBookings,
    updateBookingStatus,
    getAllBookings,
} from '../controllers/bookingController.js';

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', authenticate, createBooking);

/**
 * @route   GET /api/bookings
 * @desc    Get current user's bookings
 * @access  Private
 */
router.get('/', authenticate, getUserBookings);

/**
 * @route   GET /api/bookings/expert
 * @desc    Get bookings for expert
 * @access  Private (Expert only)
 */
router.get('/expert', authenticate, checkRole(['expert', 'admin']), getExpertBookings);

/**
 * @route   GET /api/bookings/all
 * @desc    Get all bookings (admin only)
 * @access  Private/Admin
 */
router.get('/all', authenticate, checkRole(['admin']), getAllBookings);

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking status
 * @access  Private
 */
router.put('/:id', authenticate, updateBookingStatus);

export default router;
