import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subscription' 
  }],
  activeSubscription: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subscription' 
  }
});


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
