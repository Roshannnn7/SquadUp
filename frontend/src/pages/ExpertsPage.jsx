import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/ChatWidget';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { expertAPI } from '../services/api';

const ExpertsPage = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [chatExpert, setChatExpert] = useState(null);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const { data } = await expertAPI.getAll();
            setExperts(data.data);
        } catch (error) {
            console.error('Error fetching experts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = (expert) => {
        setChatExpert(expert);
    };

    const handleBookClick = (expert) => {
        setSelectedExpert(expert);
        setBookingModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">Expert Mentors</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Connect with experienced professionals in your field
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="large" />
                        </div>
                    ) : experts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No experts available yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {experts.map((expert) => (
                                <div
                                    key={expert._id}
                                    className="glass-effect rounded-xl p-6 card-hover border border-white/10"
                                >
                                    <div className="flex items-center space-x-4 mb-4">
                                        {expert.userId?.photoURL ? (
                                            <img
                                                src={expert.userId.photoURL}
                                                alt={expert.userId.displayName}
                                                className="w-16 h-16 rounded-full border-2 border-primary-500"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                                <span className="text-white font-bold text-2xl">
                                                    {expert.userId?.displayName?.[0] || 'E'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">
                                                {expert.userId?.displayName || 'Expert'}
                                            </h3>
                                            <div className="flex items-center text-yellow-400 text-sm">
                                                <Star className="w-4 h-4 mr-1" />
                                                <span>{expert.rating.toFixed(1)} ({expert.totalReviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {expert.bio}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {expert.expertise.slice(0, 3).map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-green-400 font-semibold">
                                            ${expert.hourlyRate}/hour
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {expert.totalSessions} sessions
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleChatClick(expert)}
                                            className="flex-1 px-4 py-2 glass-effect border border-primary-500 text-primary-300 rounded-lg hover:bg-primary-500/20 transition-all flex items-center justify-center space-x-2"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            <span>Chat</span>
                                        </button>
                                        <button
                                            onClick={() => handleBookClick(expert)}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg hover:shadow-lg hover:shadow-accent-500/50 transition-all flex items-center justify-center space-x-2"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            <span>Book</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {chatExpert && (
                <ChatWidget
                    expertId={chatExpert.userId?.uid}
                    expertName={chatExpert.userId?.displayName}
                />
            )}

            <BookingModal
                isOpen={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                expert={selectedExpert}
            />
        </div>
    );
};

export default ExpertsPage;
