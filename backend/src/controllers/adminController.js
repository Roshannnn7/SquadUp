import User from '../models/User.js';
import Expert from '../models/Expert.js';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';

/**
 * Get platform statistics
 * @route GET /api/admin/stats
 */
export const getStats = async (req, res) => {
    try {
        const [totalUsers, totalExperts, totalBookings, totalMessages] = await Promise.all([
            User.countDocuments(),
            Expert.countDocuments(),
            Booking.countDocuments(),
            Message.countDocuments(),
        ]);

        // Get bookings by status
        const bookingsByStatus = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get user role distribution
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Recent bookings (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentBookings = await Booking.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalExperts,
                    totalBookings,
                    totalMessages,
                    recentBookings,
                },
                bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                usersByRole: usersByRole.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get all users with pagination
 * @route GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete user
 * @route DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Also delete expert profile if exists
        await Expert.deleteOne({ userId: req.params.id });

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Toggle user active status
 * @route PUT /api/admin/users/:id/toggle-status
 */
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
