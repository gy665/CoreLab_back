import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  coach: {
    type: String,
    required: true
  },
  description: String,
  schedule: {
    type: Date, // or Date or Array of time slots, depends on your UI
    required: true
  },
  capacity: Number,
  image: String,// optional if you want to upload an image (Cloudinary as before)
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }] 
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
