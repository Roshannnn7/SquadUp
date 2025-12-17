import User from '../models/User.js';

/**
 * Get user profile
 * @route GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.user.uid }).select('-__v');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 */
export const updateUserProfile = async (req, res) => {
    try {
        const { displayName, photoURL } = req.body;

        const user = await User.findOneAndUpdate(
            { uid: req.user.uid },
            { displayName, photoURL },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Create new user (called after Firebase signup)
 * @route POST /api/users
 */
export const createUser = async (req, res) => {
    try {
        const { uid, email, displayName, role, photoURL } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ uid });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const user = await User.create({
            uid,
            email,
            displayName,
            role: role || 'user',
            photoURL: photoURL || '',
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get all users (admin only)
 * @route GET /api/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get public users list (for chat)
 * @route GET /api/users/public
 */
export const getPublicUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('uid displayName email role photoURL')
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
