import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Expert from '../models/Expert.js';

/**
 * Create a new booking
 * @route POST /api/bookings
 */
export const createBooking = async (req, res) => {
    try {
        const { expertId, date, timeSlot, topic } = req.body;

        // Find user
        const user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Verify expert exists
        const expert = await Expert.findById(expertId);
        if (!expert) {
            return res.status(404).json({
                success: false,
                message: 'Expert not found',
            });
        }

        // Check if slot is already booked
        const existingBooking = await Booking.findOne({
            expertId,
            date: new Date(date),
            timeSlot,
            status: { $in: ['pending', 'confirmed'] },
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked',
            });
        }

        const booking = await Booking.create({
            userId: user._id,
            expertId,
            date: new Date(date),
            timeSlot,
            topic,
            status: 'pending',
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('userId', 'displayName email photoURL')
            .populate({
                path: 'expertId',
                populate: { path: 'userId', select: 'displayName email photoURL' },
            });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: populatedBooking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get user's bookings
 * @route GET /api/bookings
 */
export const getUserBookings = async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });

        const bookings = await Booking.find({ userId: user._id })
            .populate('userId', 'displayName email photoURL')
            .populate({
                path: 'expertId',
                populate: { path: 'userId', select: 'displayName email photoURL' },
            })
            .sort({ date: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get expert's bookings
 * @route GET /api/bookings/expert
 */
export const getExpertBookings = async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        const expert = await Expert.findOne({ userId: user._id });

        if (!expert) {
            return res.status(404).json({
                success: false,
                message: 'Expert profile not found',
            });
        }

        const bookings = await Booking.find({ expertId: expert._id })
            .populate('userId', 'displayName email photoURL')
            .populate({
                path: 'expertId',
                populate: { path: 'userId', select: 'displayName email photoURL' },
            })
            .sort({ date: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update booking status
 * @route PUT /api/bookings/:id
 */
export const updateBookingStatus = async (req, res) => {
    try {
        const { status, meetingLink, notes, cancellationReason } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Update fields
        if (status) booking.status = status;
        if (meetingLink) booking.meetingLink = meetingLink;
        if (notes) booking.notes = notes;
        if (cancellationReason) booking.cancellationReason = cancellationReason;

        await booking.save();

        // Update expert's total sessions if completed
        if (status === 'completed') {
            const expert = await Expert.findById(booking.expertId);
            if (expert) {
                expert.totalSessions += 1;
                await expert.save();
            }
        }

        const updatedBooking = await Booking.findById(booking._id)
            .populate('userId', 'displayName email photoURL')
            .populate({
                path: 'expertId',
                populate: { path: 'userId', select: 'displayName email photoURL' },
            });

        res.json({
            success: true,
            message: 'Booking updated successfully',
            data: updatedBooking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get all bookings (admin only)
 * @route GET /api/bookings/all
 */
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'displayName email photoURL')
            .populate({
                path: 'expertId',
                populate: { path: 'userId', select: 'displayName email photoURL' },
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
