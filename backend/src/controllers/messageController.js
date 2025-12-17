import Message from '../models/Message.js';

/**
 * Get chat history between two users
 * @route GET /api/messages/:otherUserId
 */
export const getChatHistory = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.uid;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        }).sort({ timestamp: 1 }); // Oldest first

        res.json({
            success: true,
            count: messages.length,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Send a message (also available via Socket.IO)
 * @route POST /api/messages
 */
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, messageType } = req.body;
        const senderId = req.user.uid;

        const message = await Message.create({
            senderId,
            receiverId,
            content,
            messageType: messageType || 'text',
            timestamp: new Date(),
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Mark messages as read
 * @route PUT /api/messages/read/:otherUserId
 */
export const markMessagesAsRead = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.uid;

        await Message.updateMany(
            {
                senderId: otherUserId,
                receiverId: currentUserId,
                read: false,
            },
            { read: true }
        );

        res.json({
            success: true,
            message: 'Messages marked as read',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get unread message count
 * @route GET /api/messages/unread/count
 */
export const getUnreadCount = async (req, res) => {
    try {
        const currentUserId = req.user.uid;

        const count = await Message.countDocuments({
            receiverId: currentUserId,
            read: false,
        });

        res.json({
            success: true,
            data: { unreadCount: count },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
