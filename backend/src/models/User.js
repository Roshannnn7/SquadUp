import mongoose from 'mongoose';

/**
 * User Schema
 * Represents all users in the platform (students, experts, admins)
 */
const userSchema = new mongoose.Schema(
    {
        // Firebase UID - unique identifier from Firebase Auth
        uid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        // User email
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        // Display name
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        // User role: 'user', 'expert', or 'admin'
        role: {
            type: String,
            enum: ['user', 'expert', 'admin'],
            default: 'user',
        },
        // Profile photo URL (from Firebase or custom)
        photoURL: {
            type: String,
            default: '',
        },
        // Account status
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Index for faster queries
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
