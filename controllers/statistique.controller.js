import Statistique from '../models/statistique.model.js';
import Course from '../models/course.model.js';
import Reservation from '../models/reservation.model.js';
import Equipment from '../models/equipment.model.js';

export const generateStatistiques = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const courses = await Course.find();
    const equipements = await Equipment.find();

    const totalReservations = reservations.length;
    const totalEquipementsUtilises = equipements.length; // ou calcul basé sur usage réel

    let totalCapacity = 0;
    let totalOccupied = 0;
    const popularCourses = [];

    for (let course of courses) {
      const count = await Reservation.countDocuments({ course: course._id });
      totalCapacity += course.capacity;
      totalOccupied += count;

      popularCourses.push({
        courseId: course._id,
        titre: course.title,
        reservations: count,
      });
    }

    const tauxRemplissageCours = totalCapacity > 0 
      ? Math.round((totalOccupied / totalCapacity) * 100) 
      : 0;

    const statistique = new Statistique({
      totalEquipementsUtilises,
      tauxRemplissageCours,
      totalReservations,
      coursLesPlusPopulaires: popularCourses.sort((a, b) => b.reservations - a.reservations).slice(0, 5)
    });

    await statistique.save();

    res.status(201).json(statistique);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la génération des statistiques', error: error.message });
  }
};

export const getStatistiques = async (req, res) => {
  try {
    const stats = await Statistique.find().sort({ date: -1 });
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
