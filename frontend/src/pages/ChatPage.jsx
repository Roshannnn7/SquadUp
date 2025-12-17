import { useState, useEffect } from 'react';
import { Users as UsersIcon, MessageCircle, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/ChatWidget';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminAPI } from '../services/api';

const ChatPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await adminAPI.getAllUsers({ limit: 100 });
            setUsers(data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback: show empty state
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">Chat with Community</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Connect and collaborate with students and mentors
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="large" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-20">
                            <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">
                                {searchQuery ? 'No users found matching your search' : 'No users available yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="glass-effect rounded-xl p-6 card-hover border border-white/10"
                                >
                                    <div className="flex items-center space-x-4 mb-4">
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName}
                                                className="w-14 h-14 rounded-full border-2 border-primary-500"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">
                                                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">
                                                {user.displayName || 'Anonymous'}
                                            </h3>
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                                                        ? 'bg-red-500/20 text-red-300'
                                                        : user.role === 'expert'
                                                            ? 'bg-purple-500/20 text-purple-300'
                                                            : 'bg-blue-500/20 text-blue-300'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4 truncate">
                                        {user.email}
                                    </p>

                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-medium hover:shadow-lg hover:shadow-accent-500/50 transition-all flex items-center justify-center space-x-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Start Chat</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedUser && (
                <ChatWidget
                    expertId={selectedUser.uid}
                    expertName={selectedUser.displayName || selectedUser.email}
                />
            )}
        </div>
    );
};

export default ChatPage;
