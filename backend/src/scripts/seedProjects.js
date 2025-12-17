import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/Project.js';
import User from '../models/User.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const projects = [
    {
        title: 'EcoTrack - Sustainable Living App',
        description: 'A mobile application that helps users track their carbon footprint and suggests daily eco-friendly habits. Features include gamification, community challenges, and detailed impact analytics.',
        tech: ['React Native', 'Firebase', 'Node.js', 'Redux'],
        difficulty: 'Intermediate',
        githubUrl: 'https://github.com/example/ecotrack',
    },
    {
        title: 'AI Study Companion',
        description: 'An intelligent study assistant that uses NLP to generate flashcards and quizzes from lecture notes. Includes spaced repetition algorithms and progress tracking.',
        tech: ['Python', 'TensorFlow', 'React', 'FastAPI'],
        difficulty: 'Advanced',
        githubUrl: 'https://github.com/example/ai-study',
    },
    {
        title: 'LocalMarket - Community Exchange',
        description: 'A web platform for local communities to buy, sell, and trade goods. Focuses on hyper-local discovery and trust-based transactions.',
        tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind'],
        difficulty: 'Intermediate',
        githubUrl: 'https://github.com/example/localmarket',
    },
    {
        title: 'CryptoViz - Portfolio Tracker',
        description: 'Real-time cryptocurrency portfolio tracker with advanced visualization tools. Supports integration with major exchanges via API.',
        tech: ['Vue.js', 'D3.js', 'Express', 'Socket.IO'],
        difficulty: 'Advanced',
        githubUrl: 'https://github.com/example/cryptoviz',
    },
];

const seedProjects = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Get an existing user to be the owner (Sample Expert 1)
        const owner = await User.findOne({ email: 'alex.uiux@example.com' }); // From previous seed

        if (!owner) {
            console.log('Owner not found, please run seedExperts.js first');
            process.exit(1);
        }

        // Get all users to distribute as members
        const allUsers = await User.find({});

        const additionalProjects = [
            {
                title: 'MindfulAI - Mental Health Chatbot',
                description: 'A dedicated conversational AI trained on CBT principles to provide immediate support and daily check-ins for students facing stress.',
                tech: ['Python', 'PyTorch', 'React Native', 'FastAPI'],
                difficulty: 'Advanced',
                githubUrl: 'https://github.com/example/mindfulai',
            },
            {
                title: 'BlockVote - Secure Voting',
                description: 'Decentralized voting application using Ethereum smart contracts to ensure transparency and prevent fraud in student council elections.',
                tech: ['Solidity', 'Web3.js', 'React', 'Truffle'],
                difficulty: 'Advanced',
                githubUrl: 'https://github.com/example/blockvote',
            },
            {
                title: 'EduShare - Note Sharing',
                description: 'A peer-to-peer platform for sharing lecture notes, summaries, and study guides. Incentivized with a token system.',
                tech: ['MERN Stack', 'Redux', 'AWS S3'],
                difficulty: 'Beginner',
                githubUrl: 'https://github.com/example/edushare',
            },
            {
                title: 'FitQuest - RPG Fitness App',
                description: 'Gamifies daily exercise by turning workouts into RPG battles. Users level up their characters by completing fitness goals.',
                tech: ['Flutter', 'Firebase', 'Google Fit API'],
                difficulty: 'Intermediate',
                githubUrl: 'https://github.com/example/fitquest',
            },
            {
                title: 'UrbanFarm - IoT Plant System',
                description: 'IoT-based monitoring system for indoor plants. Measures soil moisture, light, and temperature, and automates watering.',
                tech: ['C++', 'Arduino', 'Raspberry Pi', 'React'],
                difficulty: 'Advanced',
                githubUrl: 'https://github.com/example/urbanfarm',
            },
            {
                title: 'CodeCollab - Real-time Editor',
                description: 'A collaborative code editor supporting multiple languages, syntax highlighting, and integrated video chat for pair programming.',
                tech: ['Socket.IO', 'React', 'Monaco Editor', 'WebRTC'],
                difficulty: 'Advanced',
                githubUrl: 'https://github.com/example/codecollab',
            }
        ];

        const allProjects = [...projects, ...additionalProjects];

        // Clear existing
        await Project.deleteMany({});

        for (const projectData of allProjects) {
            // Pick random members from allUsers (1 to 5 members)
            const randomMembers = allUsers
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 5) + 1)
                .map(u => u._id);

            // Ensure owner is included
            const members = [...new Set([owner._id, ...randomMembers])];

            await Project.create({
                ...projectData,
                owner: owner._id,
                members: members,
            });
            console.log(`Created project: ${projectData.title} with ${members.length} members`);
        }

        console.log('Project seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding projects:');
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`- ${key}: ${err.errors[key].message}`);
                console.error(`  Value: ${err.errors[key].value}`);
            });
        } else {
            console.error(err);
        }
        process.exit(1);
    }
};

seedProjects();
