import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCall } from '../context/CallContext';
import socketService from '../services/socket';
import { messageAPI } from '../services/api';
import toast from 'react-hot-toast';

const ChatWidget = ({ expertId, expertName }) => {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const { startCall } = useCall();

    const handleVideoCall = () => {
        startCall(expertId, expertName);
        toast.success(`Calling ${expertName}... 🎥`);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // ... (rest of the code)

    return (
        <>
            {/* Floating button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-accent-500/50 transition-all z-50 animate-glow"
                >
                    <MessageCircle className="w-8 h-8 text-white" />
                </button>
            )}

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[500px] glass-effect rounded-lg shadow-2xl flex flex-col z-50 border border-white/10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 gradient-bg">
                        <div>
                            <h3 className="font-semibold text-white">Chat with {expertName}</h3>
                            <p className="text-xs text-gray-200">Online</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleVideoCall}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Start Video Call"
                            >
                                <Video className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <Minimize2 className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-400 mt-10">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isOwn = msg.senderId === currentUser.uid;
                                return (
                                    <div
                                        key={msg._id}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwn
                                                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                                                : 'bg-gray-800 text-gray-200'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs opacity-70 mt-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 rounded-lg px-4 py-2">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                            style={{ animationDelay: '0.2s' }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                            style={{ animationDelay: '0.4s' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg hover:shadow-lg hover:shadow-accent-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
