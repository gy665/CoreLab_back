// jobs/reminders.job.js
import cron from 'node-cron';
import Reservation from '../models/reservation.model.js';
import Course from '../models/course.model.js';
import { sendReservationNotification } from '../utils/notification.utils.js';

// Runs daily at 9:00 AM (configure time as needed)
cron.schedule('0 9 * * *', async () => {
  try {
    // 1. Calculate tomorrow's date range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

    // 2. Fetch reservations happening tomorrow
    const reservations = await Reservation.find({
      sessionDate: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ['confirmed', 'pending'] } // Skip cancelled/completed
    }).populate({
      path: 'course',
      select: 'title' // Only fetch necessary fields
    });

    // 3. Send reminders for each reservation
    for (const reservation of reservations) {
      // ✅ Place the notification here:
      await sendReservationNotification(
        reservation.user,          // User ID
        reservation._id,          // Reservation ID
        'reminder',               // Type
        reservation.course.title, // Course title
        { 
          sessionDate: reservation.sessionDate // Pass date for formatting
        }
      );

      console.log(`Reminder sent for ${reservation.course.title}`);
    }
  } catch (error) {
    console.error('⚠️ Reminder job failed:', error);
  }
});