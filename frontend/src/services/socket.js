import { io } from 'socket.io-client';

/**
 * Socket.IO Client Configuration
 */
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    /**
     * Connect to Socket.IO server
     */
    connect(userId) {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
            this.connected = true;

            // Register user
            if (userId) {
                this.socket.emit('user:join', userId);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    /**
     * Disconnect from Socket.IO server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    /**
     * Send a message
     */
    sendMessage(data) {
        if (!this.socket?.connected) {
            console.error('Socket not connected');
            return;
        }
        this.socket.emit('message:send', data);
    }

    /**
     * Listen for incoming messages
     */
    onMessage(callback) {
        if (!this.socket) return;
        this.socket.on('message:receive', callback);
    }

    /**
     * Remove message listener
     */
    offMessage(callback) {
        if (!this.socket) return;
        this.socket.off('message:receive', callback);
    }

    /**
     * Emit typing started
     */
    startTyping(senderId, receiverId) {
        if (!this.socket?.connected) return;
        this.socket.emit('typing:start', { senderId, receiverId });
    }

    /**
     * Emit typing stopped
     */
    stopTyping(senderId, receiverId) {
        if (!this.socket?.connected) return;
        this.socket.emit('typing:stop', { senderId, receiverId });
    }

    /**
     * Listen for typing indicators
     */
    onTyping(callback) {
        if (!this.socket) return;
        this.socket.on('typing:started', callback);
    }

    onStopTyping(callback) {
        if (!this.socket) return;
        this.socket.on('typing:stopped', callback);
    }

    /**
     * Mark messages as read
     */
    markAsRead(senderId, receiverId) {
        if (!this.socket?.connected) return;
        this.socket.emit('messages:read', { senderId, receiverId });
    }

    /**
     * Listen for user online status
     */
    onUserOnline(callback) {
        if (!this.socket) return;
        this.socket.on('user:online', callback);
    }

    onUserOffline(callback) {
        if (!this.socket) return;
        this.socket.on('user:offline', callback);
    }

    /**
     * Get socket instance
     */
    getSocket() {
        return this.socket;
    }

    /**
     * Check connection status
     */
    isConnected() {
        return this.connected && this.socket?.connected;
    }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
