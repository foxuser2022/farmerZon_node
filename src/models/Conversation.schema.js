import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});

// Ensure participants array has exactly 2 unique users
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Conversation must have exactly 2 participants'));
  }
  
  if (this.participants[0].toString() === this.participants[1].toString()) {
    return next(new Error('Cannot create conversation with yourself'));
  }
  
  next();
});

// Create a compound index to ensure unique conversations between the same two users
conversationSchema.index({ participants: 1 }, { unique: true });

export default mongoose.model('Conversation', conversationSchema); 