import Conversation from '../models/Conversation.schema.js';
import Message from '../models/Message.schema.js';
import User from '../models/Users.schema.js';

// Socket.IO instance (will be set from server.js)
let io;

export const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Get all conversations for the current user
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name email role avatar')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name'
      }
    })
    .sort({ updatedAt: -1 });

    // Calculate unread count for each conversation
    const conversationsWithUnread = conversations.map(conv => {
      const unreadCount = conv.unreadCount.get(userId.toString()) || 0;
      return {
        ...conv.toObject(),
        unreadCount
      };
    });

    res.json({
      success: true,
      conversations: conversationsWithUnread
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get conversations' 
    });
  }
};

// Get messages for a specific conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this conversation' 
      });
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email role avatar')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get messages' 
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message content is required' 
      });
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }

    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to send message to this conversation' 
      });
    }

    // Create the message
    const message = new Message({
      conversationId,
      sender: senderId,
      content: content.trim()
    });

    await message.save();

    // Update conversation's last message and unread count
    const otherParticipant = conversation.participants.find(
      p => p.toString() !== senderId.toString()
    );
    
    if (otherParticipant) {
      const currentUnread = conversation.unreadCount.get(otherParticipant.toString()) || 0;
      conversation.unreadCount.set(otherParticipant.toString(), currentUnread + 1);
    }
    
    conversation.lastMessage = message._id;
    await conversation.save();

    // Populate sender info for response
    await message.populate('sender', 'name email role avatar');

    // Emit socket event for real-time messaging
    if (io) {
      const otherParticipant = conversation.participants.find(
        p => p.toString() !== senderId.toString()
      );
      
      io.to(`user_${otherParticipant}`).emit('receive_message', {
        message: message,
        conversationId: conversationId
      });
    }

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message' 
    });
  }
};

// Create a new conversation
const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    if (!participantId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Participant ID is required' 
      });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Participant not found' 
      });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] }
    });

    if (existingConversation) {
      return res.status(409).json({ 
        success: false, 
        message: 'Conversation already exists',
        conversation: existingConversation
      });
    }

    // Create new conversation
    const conversation = new Conversation({
      participants: [userId, participantId]
    });

    await conversation.save();

    // Populate participants for response
    await conversation.populate('participants', 'name email role avatar');

    res.status(201).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create conversation' 
    });
  }
};

// Get all users for starting new conversations
const getUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const users = await User.find({ _id: { $ne: userId } })
      .select('name email role avatar')
      .sort({ name: 1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get users' 
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this conversation' 
      });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      { 
        conversationId, 
        sender: { $ne: userId }, 
        read: false 
      },
      { 
        read: true, 
        readAt: new Date() 
      }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(userId.toString(), 0);
    await conversation.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to mark messages as read' 
    });
  }
};

export default {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  getUsers,
  markAsRead
}; 