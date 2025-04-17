import express from 'express';
import { createReservation,
     getUserReservations,
    cancelReservation,
    updateReservation
 } from '../controllers/reservation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createReservation);
router.get('/my-reservations/:id', getUserReservations);
router.delete('/:id', cancelReservation);
router.patch('/:id', updateReservation);

export default router;