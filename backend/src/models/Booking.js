import mongoose from 'mongoose';

/**
 * Booking Schema
 * Represents session bookings between users and experts
 */
const bookingSchema = new mongoose.Schema(
    {
        // User who made the booking
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Expert being booked
        expertId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expert',
            required: true,
        },
        // Booking date
        date: {
            type: Date,
            required: true,
        },
        // Time slot (e.g., "14:00-15:00")
        timeSlot: {
            type: String,
            required: true,
        },
        // Session topic/description
        topic: {
            type: String,
            required: true,
            maxlength: 300,
        },
        // Booking status
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        // Meeting link (Zoom, Google Meet, etc.)
        meetingLink: {
            type: String,
            default: '',
        },
        // Session notes (added after session)
        notes: {
            type: String,
            default: '',
        },
        // Cancellation reason (if cancelled)
        cancellationReason: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ expertId: 1, date: 1 });
bookingSchema.index({ status: 1 });

// Compound index for finding bookings by expert and date
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
