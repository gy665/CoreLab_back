import express from 'express';
import { register, login, updateUser, deleteUser } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;
