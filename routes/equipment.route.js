import express from 'express';
import {
  getEquipments,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipment.controller.js';

const router = express.Router();

router.get('/', getEquipments);
router.get('/:id', getEquipment);
router.post('/', createEquipment);
router.patch('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
