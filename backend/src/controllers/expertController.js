import Expert from '../models/Expert.js';
import User from '../models/User.js';

/**
 * Get all experts with user details
 * @route GET /api/experts
 */
export const getAllExperts = async (req, res) => {
    try {
        const experts = await Expert.find()
            .populate('userId', 'displayName email photoURL')
            .sort({ rating: -1 }); // Sort by highest rating

        res.json({
            success: true,
            count: experts.length,
            data: experts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get single expert by ID
 * @route GET /api/experts/:id
 */
export const getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id)
            .populate('userId', 'displayName email photoURL');

        if (!expert) {
            return res.status(404).json({
                success: false,
                message: 'Expert not found',
            });
        }

        res.json({
            success: true,
            data: expert,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Create expert profile (user must have 'expert' role)
 * @route POST /api/experts
 */
export const createExpertProfile = async (req, res) => {
    try {
        const { bio, expertise, hourlyRate, availability, yearsOfExperience, linkedinUrl, githubUrl } = req.body;

        // Find user by UID
        const user = await User.findOne({ uid: req.user.uid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if expert profile already exists
        const existingExpert = await Expert.findOne({ userId: user._id });
        if (existingExpert) {
            return res.status(400).json({
                success: false,
                message: 'Expert profile already exists',
            });
        }

        const expert = await Expert.create({
            userId: user._id,
            bio,
            expertise,
            hourlyRate,
            availability: availability || [],
            yearsOfExperience: yearsOfExperience || 0,
            linkedinUrl: linkedinUrl || '',
            githubUrl: githubUrl || '',
        });

        // Update user role to expert if not already
        if (user.role !== 'expert') {
            user.role = 'expert';
            await user.save();
        }

        const populatedExpert = await Expert.findById(expert._id)
            .populate('userId', 'displayName email photoURL');

        res.status(201).json({
            success: true,
            message: 'Expert profile created successfully',
            data: populatedExpert,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update expert profile
 * @route PUT /api/experts/:id
 */
export const updateExpertProfile = async (req, res) => {
    try {
        const { bio, expertise, hourlyRate, availability, yearsOfExperience, linkedinUrl, githubUrl } = req.body;

        const expert = await Expert.findById(req.params.id);

        if (!expert) {
            return res.status(404).json({
                success: false,
                message: 'Expert not found',
            });
        }

        // Check if user owns this expert profile
        const user = await User.findOne({ uid: req.user.uid });
        if (expert.userId.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile',
            });
        }

        // Update fields
        if (bio) expert.bio = bio;
        if (expertise) expert.expertise = expertise;
        if (hourlyRate !== undefined) expert.hourlyRate = hourlyRate;
        if (availability) expert.availability = availability;
        if (yearsOfExperience !== undefined) expert.yearsOfExperience = yearsOfExperience;
        if (linkedinUrl !== undefined) expert.linkedinUrl = linkedinUrl;
        if (githubUrl !== undefined) expert.githubUrl = githubUrl;

        await expert.save();

        const updatedExpert = await Expert.findById(expert._id)
            .populate('userId', 'displayName email photoURL');

        res.json({
            success: true,
            message: 'Expert profile updated successfully',
            data: updatedExpert,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
