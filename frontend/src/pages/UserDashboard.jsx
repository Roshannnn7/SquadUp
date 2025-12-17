import { useState, useEffect } from 'react';
import { Calendar, Folder, Video, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, projectAPI } from '../services/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const { currentUser, userProfile } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch bookings
                const bookingsRes = await bookingAPI.getUserBookings();
                setBookings(bookingsRes.data.data);

                // Fetch real projects and filter (simplified for now)
                const projectsRes = await projectAPI.getAll();
                const userProjects = projectsRes.data.data.filter(p =>
                    p.members.some(m => m._id === userProfile?._id || m === userProfile?._id)
                );
                setMyProjects(userProjects);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (userProfile) {
            fetchData();
        }
    }, [userProfile]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-green-400 bg-green-400/10';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10';
            case 'completed': return 'text-blue-400 bg-blue-400/10';
            case 'cancelled': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-12">
                        {userProfile?.photoURL ? (
                            <img
                                src={userProfile.photoURL}
                                alt="Profile"
                                className="w-20 h-20 rounded-full border-4 border-primary-500"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <span className="text-white font-bold text-3xl">
                                    {userProfile?.displayName?.[0] || 'U'}
                                </span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Welcome back, {userProfile?.displayName}!
                            </h1>
                            <p className="text-gray-400">
                                {userProfile?.email} • {userProfile?.role}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="large" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Bookings Section */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <Calendar className="w-6 h-6 mr-2 text-primary-500" />
                                    Your Sessions
                                </h2>

                                {bookings.length === 0 ? (
                                    <div className="glass-effect p-8 rounded-xl text-center border border-white/10">
                                        <p className="text-gray-400 mb-4">No sessions booked yet</p>
                                        <a href="/experts" className="text-primary-400 hover:text-primary-300">
                                            Find an expert to book →
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => (
                                            <div key={booking._id} className="glass-effect p-6 rounded-xl border border-white/10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {booking.topic}
                                                        </h3>
                                                        <p className="text-gray-400 text-sm">
                                                            with {booking.expertId?.userId?.displayName || 'Expert'}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-6 text-sm text-gray-300">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {new Date(booking.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {booking.timeSlot}
                                                    </div>
                                                </div>
                                                {booking.meetingLink && (
                                                    <a
                                                        href={booking.meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-4 inline-flex items-center text-primary-400 hover:text-primary-300"
                                                    >
                                                        <Video className="w-4 h-4 mr-2" />
                                                        Join Meeting
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Projects Section */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <Folder className="w-6 h-6 mr-2 text-accent-500" />
                                    Your Projects
                                </h2>

                                {myProjects.length === 0 ? (
                                    <div className="glass-effect p-8 rounded-xl text-center border border-white/10">
                                        <p className="text-gray-400 mb-4">You haven't joined any projects</p>
                                        <a href="/projects" className="text-accent-400 hover:text-accent-300">
                                            Explore projects →
                                        </a>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myProjects.map((project) => (
                                            <div key={project._id} className="glass-effect p-6 rounded-xl border border-white/10">
                                                <h3 className="text-lg font-semibold text-white mb-2">
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tech?.slice(0, 3).map(t => (
                                                        <span key={t} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
