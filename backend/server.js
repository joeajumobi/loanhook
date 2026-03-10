import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import financeRoutes from './routes/finance.js';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import chatrouter from './routes/chat.js';

dotenv.config();
console.log("Key Check:", process.env.GEMINI_API_KEY ? "Key is loaded ✅" : "Key is MISSING ❌");
import aiRoutes from './routes/aiSuggestions.js';



const app = express();
app.use(express.json());
app.use(cors({origin : '*'})); // Allow all origins for development, adjust in production
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Backend is working !');
});

app.use('/api/finance', financeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatrouter);


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// backend/server.js
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const createTestUser = async () => {
  const testEmail = "testuser@loanhook.app";
  const existingUser = await User.findOne({ email: testEmail });
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("testpassword123", 10);
    await User.create({
      fullName: "Demo User",
      email: testEmail,
      password: hashedPassword
    });
    console.log("✅ Demo account created: testuser@loanhook.app");
  }
};

// Call this after your MongoDB connection is established
createTestUser();