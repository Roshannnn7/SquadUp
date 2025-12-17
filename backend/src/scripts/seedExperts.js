import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Expert from '../models/Expert.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const users = [
    {
        uid: 'seed-expert-1',
        email: 'alex.uiux@example.com',
        displayName: 'Alex Rivera',
        role: 'expert',
        photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    },
    {
        uid: 'seed-expert-2',
        email: 'sarah.dev@example.com',
        displayName: 'Sarah Chen',
        role: 'expert',
        photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    },
    {
        uid: 'seed-expert-3',
        email: 'mike.mobile@example.com',
        displayName: 'Mike Johnson',
        role: 'expert',
        photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    },
];

const experts = [
    {
        bio: 'Senior UI/UX Designer with 8 years of experience creating intuitive digital experiences. Specialized in Design Systems, User Research, and Prototyping. Previous experience at top tech startups.',
        expertise: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Web Design'],
        hourlyRate: 85,
        rating: 4.9,
        totalReviews: 42,
        yearsOfExperience: 8,
        totalSessions: 156,
    },
    {
        bio: 'Full Stack Developer passionate about scalable architecture and clean code. Expert in the MERN stack and cloud infrastructure. React Native enthusiast.',
        expertise: ['Full Stack Dev', 'React', 'Node.js', 'MongoDB', 'AWS'],
        hourlyRate: 95,
        rating: 4.8,
        totalReviews: 38,
        yearsOfExperience: 6,
        totalSessions: 120,
    },
    {
        bio: 'Mobile Application Developer specializing in cross-platform development. I help students build their first mobile apps and launch them to the App Store.',
        expertise: ['Mobile Dev', 'React Native', 'Flutter', 'iOS', 'Android'],
        hourlyRate: 75,
        rating: 4.7,
        totalReviews: 25,
        yearsOfExperience: 4,
        totalSessions: 85,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Clear existing experts
        // Note: In a real scenario, be careful clearing data.
        // For development, we'll just check if they exist or append.
        // Let's safe-mode: specific seed UIDs.

        for (let i = 0; i < users.length; i++) {
            const userData = users[i];
            const expertData = experts[i];

            // 1. Create or Update User
            let user = await User.findOne({ uid: userData.uid });
            if (!user) {
                user = await User.create(userData);
                console.log(`Created user: ${user.displayName}`);
            } else {
                user = await User.findOneAndUpdate({ uid: userData.uid }, userData, { new: true });
                console.log(`Updated user: ${user.displayName}`);
            }

            // 2. Create or Update Expert Profile
            const existingExpert = await Expert.findOne({ userId: user._id });
            if (!existingExpert) {
                await Expert.create({
                    ...expertData,
                    userId: user._id,
                });
                console.log(`Created expert profile for: ${user.displayName}`);
            } else {
                await Expert.findOneAndUpdate({ userId: user._id }, expertData);
                console.log(`Updated expert profile for: ${user.displayName}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
