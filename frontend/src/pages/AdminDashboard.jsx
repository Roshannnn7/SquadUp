import { useState, useEffect } from 'react';
import { Users, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getAllUsers({ limit: 10 }),
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.overview?.totalUsers || 0,
            icon: <Users className="w-8 h-8" />,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Total Experts',
            value: stats?.overview?.totalExperts || 0,
            icon: <TrendingUp className="w-8 h-8" />,
            color: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Total Bookings',
            value: stats?.overview?.totalBookings || 0,
            icon: <BookOpen className="w-8 h-8" />,
            color: 'from-green-500 to-teal-500',
        },
        {
            title: 'Total Messages',
            value: stats?.overview?.totalMessages || 0,
            icon: <MessageSquare className="w-8 h-8" />,
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold gradient-text mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400">Platform overview and management</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className="glass-effect rounded-xl p-6 border border-white/10"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <span className="text-3xl font-bold text-white">
                                        {stat.value}
                                    </span>
                                </div>
                                <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Recent Users Table */}
                    <div className="glass-effect rounded-xl p-6 border border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Recent Users</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-700">
                                        <th className="pb-3 text-gray-400 font-medium">Name</th>
                                        <th className="pb-3 text-gray-400 font-medium">Email</th>
                                        <th className="pb-3 text-gray-400 font-medium">Role</th>
                                        <th className="pb-3 text-gray-400 font-medium">Status</th>
                                        <th className="pb-3 text-gray-400 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 text-white">{user.displayName}</td>
                                            <td className="py-4 text-gray-400">{user.email}</td>
                                            <td className="py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin'
                                                            ? 'bg-red-500/20 text-red-300'
                                                            : user.role === 'expert'
                                                                ? 'bg-purple-500/20 text-purple-300'
                                                                : 'bg-blue-500/20 text-blue-300'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs ${user.isActive
                                                            ? 'bg-green-500/20 text-green-300'
                                                            : 'bg-gray-500/20 text-gray-300'
                                                        }`}
                                                >
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
