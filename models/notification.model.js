// models/notification.model.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  },
  type: {
    type: String,
    enum: ['created', 'updated', 'cancelled', 'reminder'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  metadata: mongoose.Schema.Types.Mixed // For additional data
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);