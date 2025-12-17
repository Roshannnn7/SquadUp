import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initializeChatSocket } from './socket/chatHandler.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Connect to database
connectDB();

// Initialize Firebase Admin SDK
initializeFirebase();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SquadUp API is running! 🚀',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        uptime: process.uptime(),
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

// Initialize Socket.IO chat
initializeChatSocket(io);

// Make io accessible in routes if needed
app.set('io', io);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 SquadUp Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API: http://localhost:${PORT}`);
    console.log(`💬 Socket.IO ready for connections`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    // Close server & exit process
    httpServer.close(() => process.exit(1));
});

export default app;
