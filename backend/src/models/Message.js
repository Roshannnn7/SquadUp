import mongoose from 'mongoose';

/**
 * Message Schema
 * Real-time chat messages between users and experts
 */
const messageSchema = new mongoose.Schema(
    {
        // Sender's user ID (Firebase UID)
        senderId: {
            type: String,
            required: true,
            index: true,
        },
        // Receiver's user ID (Firebase UID)
        receiverId: {
            type: String,
            required: true,
            index: true,
        },
        // Message content
        content: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        // Message timestamp
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
        // Read status
        read: {
            type: Boolean,
            default: false,
        },
        // Message type (text, image, file, etc.)
        messageType: {
            type: String,
            enum: ['text', 'image', 'file'],
            default: 'text',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for chat queries (messages between two users)
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
messageSchema.index({ receiverId: 1, read: 1 }); // For unread messages

const Message = mongoose.model('Message', messageSchema);

export default Message;
