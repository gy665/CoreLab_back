import express from 'express';
import { chatWithBot } from '../controllers/chat.controller.js';


const router = express.Router();

router.post('/chat', chatWithBot);


export default router;

