import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a project title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    tech: [{
        type: String,
        trim: true,
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed'],
        default: 'Open',
    },
    githubUrl: {
        type: String,
        match: [
            /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/,
            'Please provide a valid GitHub URL',
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Project', projectSchema);
