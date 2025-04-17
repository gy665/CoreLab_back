import express from 'express';
import { generateStatistiques, getStatistiques } from '../controllers/statistique.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', generateStatistiques); // Générer manuellement les stats
router.get('/', getStatistiques); // Consulter les stats

export default router;
