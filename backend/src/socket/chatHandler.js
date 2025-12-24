import Message from '../models/Message.js';

/**
 * Socket.IO Chat Handler
 * Handles real-time chat functionality
 */
export const initializeChatSocket = (io) => {
    // Store connected users (uid -> socketId)
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        /**
         * User joins - register their socket
         */
        socket.on('user:join', (userId) => {
            connectedUsers.set(userId, socket.id);
            socket.userId = userId;
            console.log(`👤 User ${userId} joined with socket ${socket.id}`);

            // Notify user is online
            socket.broadcast.emit('user:online', userId);
        });

        /**
         * Send message
         */
        socket.on('message:send', async (data) => {
            try {
                const { senderId, receiverId, content, messageType = 'text' } = data;

                // Save message to database
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content,
                    messageType,
                    timestamp: new Date(),
                });

                // Send to receiver if online
                const receiverSocketId = connectedUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message:receive', message);
                }

                // Confirm to sender
                socket.emit('message:sent', message);

                console.log(`💬 Message from ${senderId} to ${receiverId}`);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message:error', { message: 'Failed to send message' });
            }
        });

        /**
         * Typing indicator
         */
        socket.on('typing:start', (data) => {
            const { receiverId, senderId } = data;
            const receiverSocketId = connectedUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing:started', { userId: senderId });
            }
        });

        socket.on('typing:stop', (data) => {
            const { receiverId, senderId } = data;
            const receiverSocketId = connectedUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing:stopped', { userId: senderId });
            }
        });

        /**
         * Mark messages as read
         */
        socket.on('messages:read', async (data) => {
            try {
                const { senderId, receiverId } = data;

                await Message.updateMany(
                    { senderId, receiverId, read: false },
                    { read: true }
                );

                // Notify sender that messages were read
                const senderSocketId = connectedUsers.get(senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messages:read', { userId: receiverId });
                }
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        /**
         * Call signaling
         */
        socket.on('call:request', (data) => {
            const { receiverId, callerName, type } = data; // type: 'video' | 'audio'
            const receiverSocketId = connectedUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('call:incoming', {
                    callerId: socket.userId,
                    callerName,
                    type,
                    signal: data.signal
                });
            }
        });

        socket.on('call:accepted', (data) => {
            const { callerId, signal } = data;
            const callerSocketId = connectedUsers.get(callerId);
            if (callerSocketId) {
                io.to(callerSocketId).emit('call:accepted', {
                    receiverId: socket.userId,
                    signal
                });
            }
        });

        socket.on('call:rejected', (data) => {
            const { callerId } = data;
            const callerSocketId = connectedUsers.get(callerId);
            if (callerSocketId) {
                io.to(callerSocketId).emit('call:rejected', {
                    receiverId: socket.userId
                });
            }
        });

        socket.on('call:signaling', (data) => {
            const { to, signal } = data;
            const targetSocketId = connectedUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('call:signaling', {
                    from: socket.userId,
                    signal
                });
            }
        });

        socket.on('call:end', (data) => {
            const { to } = data;
            const targetSocketId = connectedUsers.get(to);
            if (targetSocketId) {
                io.to(targetSocketId).emit('call:ended');
            }
        });

        /**
         * User disconnects
         */
        socket.on('disconnect', () => {
            if (socket.userId) {
                connectedUsers.delete(socket.userId);
                // Notify others user is offline
                socket.broadcast.emit('user:offline', socket.userId);

                // End any active calls (simplified)
                socket.broadcast.emit('call:ended', { userId: socket.userId });

                console.log(`👋 User ${socket.userId} disconnected`);
            }
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};
