import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getChatHistory,
    sendMessage,
    markMessagesAsRead,
    getUnreadCount,
} from '../controllers/messageController.js';

const router = express.Router();

/**
 * @route   GET /api/messages/:otherUserId
 * @desc    Get chat history with another user
 * @access  Private
 */
router.get('/:otherUserId', authenticate, getChatHistory);

/**
 * @route   POST /api/messages
 * @desc    Send a message
 * @access  Private
 */
router.post('/', authenticate, sendMessage);

/**
 * @route   PUT /api/messages/read/:otherUserId
 * @desc    Mark messages as read
 * @access  Private
 */
router.put('/read/:otherUserId', authenticate, markMessagesAsRead);

/**
 * @route   GET /api/messages/unread/count
 * @desc    Get unread message count
 * @access  Private
 */
router.get('/unread/count', authenticate, getUnreadCount);

export default router;
