import mongoose from 'mongoose';

const statistiqueSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  totalEquipementsUtilises: {
    type: Number,
    required: true,
  },
  tauxRemplissageCours: {
    type: Number, // En pourcentage (ex. 75)
    required: true,
  },
  totalReservations: {
    type: Number,
    required: true,
  },
  coursLesPlusPopulaires: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      titre: String,
      reservations: Number,
    }
  ]
});

const Statistique = mongoose.model('Statistique', statistiqueSchema);
export default Statistique;
