import express from 'express';
import { chatWithBot,getConversation  } from '../controllers/chat.controller.js';


const router = express.Router();

router.post('/chat', chatWithBot);
router.get('/chat/conversation/:userId', getConversation);



export default router;

