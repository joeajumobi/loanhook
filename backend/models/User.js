import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // Since you're building LoanHook, you might add these later:
  fullName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// This exports the model so your Controllers can use it to find/create users
export default mongoose.model('User', UserSchema);