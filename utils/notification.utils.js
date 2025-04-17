// utils/notification.utils.js
import Notification from '../models/notification.model.js';

const MESSAGE_TEMPLATES = {
  created: (courseTitle) => `Reservation confirmed for ${courseTitle}`,
  updated: (courseTitle, changes) => `Updated: Your ${courseTitle} booking (${changes})`, 
  cancelled: (courseTitle) => `Cancelled: ${courseTitle} reservation`,
  reminder: (courseTitle, date) => `Reminder: ${courseTitle} at ${date.toLocaleString('fr-FR')}`,
  
};

export const sendReservationNotification = async (
  userId,
  reservationId,
  type, // 'created' | 'updated' | 'cancelled' | 'reminder' | 
  courseTitle,
  metadata = {} // Additional data like date/changes
) => {
  try {
    const message = MESSAGE_TEMPLATES[type](courseTitle, metadata.changes);
    
    return await Notification.create({
      user: userId,
      reservation: reservationId,
      type,
      title: `Reservation ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message,
      read: false,
      metadata
    });
  } catch (error) {
    console.error('Notification creation failed:', error);
    throw error; // Or handle gracefully
  }
};