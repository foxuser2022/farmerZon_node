import express from 'express';
import messageController from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all conversations for the current user
router.get('/conversations', messageController.getConversations);

// Get all users for starting new conversations
router.get('/users', messageController.getUsers);

// Create a new conversation
router.post('/conversations', messageController.createConversation);

// Get messages for a specific conversation
router.get('/conversations/:conversationId', messageController.getMessages);

// Send a message to a conversation
router.post('/conversations/:conversationId', messageController.sendMessage);

// Mark messages as read
router.put('/conversations/:conversationId/read', messageController.markAsRead);

export default router; 