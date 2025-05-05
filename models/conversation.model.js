import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: String,
  isUserMessage: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  userId: String, 
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;