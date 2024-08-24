// routes/chat.js
import express from 'express';
import getChats from '../Controllers/chats.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get chat history between two users
router.get('/:from/:to', verifyToken,getChats);

export default router;
