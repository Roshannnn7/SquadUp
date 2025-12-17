import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, expert }) => {
    const [formData, setFormData] = useState({
        date: '',
        timeSlot: '',
        topic: '',
    });
    const [loading, setLoading] = useState(false);

    // Generate time slots
    const timeSlots = [
        '09:00-10:00',
        '10:00-11:00',
        '11:00-12:00',
        '12:00-13:00',
        '14:00-15:00',
        '15:00-16:00',
        '16:00-17:00',
        '17:00-18:00',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date || !formData.timeSlot || !formData.topic) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await bookingAPI.create({
                expertId: expert._id,
                date: formData.date,
                timeSlot: formData.timeSlot,
                topic: formData.topic,
            });

            toast.success('Booking request sent successfully! 🎉');
            setFormData({ date: '', timeSlot: '', topic: '' });
            onClose();
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !expert) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="gradient-bg p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2">Book a Session</h2>
                    <p className="text-gray-200">
                        with {expert.userId?.displayName || 'Expert'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Expert Info */}
                    <div className="glass-effect p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                            {expert.userId?.photoURL ? (
                                <img
                                    src={expert.userId.photoURL}
                                    alt={expert.userId.displayName}
                                    className="w-12 h-12 rounded-full border-2 border-primary-500"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {expert.userId?.displayName?.[0] || 'E'}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-white">
                                    {expert.userId?.displayName}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    ${expert.hourlyRate}/hour
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {expert.expertise.slice(0, 3).map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({ ...formData, date: e.target.value })
                            }
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    {/* Time Slot */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Time Slot
                        </label>
                        <select
                            value={formData.timeSlot}
                            onChange={(e) =>
                                setFormData({ ...formData, timeSlot: e.target.value })
                            }
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        >
                            <option value="">Select a time slot</option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Topic */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Session Topic
                        </label>
                        <textarea
                            value={formData.topic}
                            onChange={(e) =>
                                setFormData({ ...formData, topic: e.target.value })
                            }
                            placeholder="What would you like to discuss?"
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg font-medium text-white hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-accent-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Booking...' : 'Book Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
