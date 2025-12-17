import mongoose from 'mongoose';

/**
 * Expert Schema
 * Extended profile information for users with 'expert' role
 */
const expertSchema = new mongoose.Schema(
    {
        // Reference to User model
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        // Professional bio
        bio: {
            type: String,
            required: true,
            maxlength: 500,
        },
        // Areas of expertise (e.g., ["React", "Node.js", "MongoDB"])
        expertise: {
            type: [String],
            required: true,
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'At least one expertise area is required',
            },
        },
        // Hourly rate for consultations (in USD)
        hourlyRate: {
            type: Number,
            required: true,
            min: 0,
        },
        // Available time slots
        // Format: ["Monday 9-12", "Tuesday 14-17", "Friday 10-15"]
        availability: {
            type: [String],
            default: [],
        },
        // Average rating (0-5)
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        // Total number of reviews
        totalReviews: {
            type: Number,
            default: 0,
        },
        // Total sessions completed
        totalSessions: {
            type: Number,
            default: 0,
        },
        // Years of experience
        yearsOfExperience: {
            type: Number,
            default: 0,
            min: 0,
        },
        // LinkedIn profile URL
        linkedinUrl: {
            type: String,
            default: '',
        },
        // GitHub profile URL
        githubUrl: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Index for searching experts by expertise
expertSchema.index({ expertise: 1 });
expertSchema.index({ rating: -1 }); // Descending order for top-rated

const Expert = mongoose.model('Expert', expertSchema);

export default Expert;
