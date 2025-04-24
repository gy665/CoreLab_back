import express from 'express';
import {
  createPurchase,
  getAllPurchases,
  getPurchasesByUser,
  getSinglePurchase
} from '../controllers/equipmentpurchase.controller.js';

const router = express.Router();

router.post('/', createPurchase);
router.get('/', getAllPurchases);
router.get('/user/:userId', getPurchasesByUser);
router.get('/:id', getSinglePurchase);

export default router;
