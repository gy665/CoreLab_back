import Reservation from '../models/reservation.model.js';
import Course from '../models/course.model.js';
import { sendReservationNotification } from '../utils/notification.utils.js';


export const createReservation = async (req, res) => {
    try {
        const { courseId, sessionDate, notes } = req.body;
        const userId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check capacity including only active reservations
        const activeReservations = await Reservation.countDocuments({
            course: courseId,
            sessionDate,
            status: { $in: ['confirmed', 'pending'] }
        });
        if (activeReservations >= course.capacity) {
            return res.status(400).json({ message: 'Course session is full' });
        }

        const reservation = await Reservation.create({
            user: userId,
            course: courseId,
            sessionDate,
            notes,
            status: 'confirmed'
        });

        await Course.findByIdAndUpdate(courseId, {
            $push: { reservations: reservation._id }
        });

        // Notification with additional context
        await sendReservationNotification(
            userId,
            reservation._id,
            'created',
            course.title,
            {
                sessionDate: reservation.sessionDate,
                instructor: course.coach
            }
        );

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create reservation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { sessionDate, notes } = req.body;
        const userId = req.user._id;

        const oldReservation = await Reservation.findById(id);
        if (!oldReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        const reservation = await Reservation.findOneAndUpdate(
            { _id: id, user: userId },
            { sessionDate, notes },
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(403).json({ message: 'Not your reservation' });
        }

        const course = await Course.findById(reservation.course).select('title');

        // Only send notification if date actually changed
        if (sessionDate && oldReservation.sessionDate !== sessionDate) {
            await sendReservationNotification(
                userId,
                reservation._id,
                'updated',
                course.title,
                {
                    
                    oldDate: oldReservation.sessionDate,
                    newDate: sessionDate
                }
            );
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update reservation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const reservation = await Reservation.findOneAndDelete({
            _id: id,
            user: userId
        }).populate('course', 'title');

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found or not yours' });
        }

        await Course.findByIdAndUpdate(
            reservation.course._id,
            { $pull: { reservations: reservation._id } }
        );

        await sendReservationNotification(
            userId,
            reservation._id,
            'cancelled',
            reservation.course.title,
            {
                cancelledAt: new Date()
            }
        );

        res.status(200).json({
            message: 'Reservation cancelled successfully',
            cancelledId: reservation._id
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to cancel reservation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// getUserReservations remains the same


export const getUserReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id })
            .populate('course', 'title coach schedule');

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
