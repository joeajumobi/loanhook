import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Route Imports
import financeRoutes from './routes/finance.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiSuggestions.js';
import chatrouter from './routes/chat.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Model & Utility Imports
import User from './models/User.js';
import ApplicantProfile from './models/ApplicantProfile.js';
import generateApplicant from './utils/generateApplicant.js';

dotenv.config();

// Debugging API Key
console.log("Key Check:", process.env.GEMINI_API_KEY ? "Key is loaded ✅" : "Key is MISSING ❌");

const app = express();

// Middleware
app.use(express.json());
// Allowing all origins for development to prevent CORS blocks
app.use(cors({ origin: '*' })); 

const PORT = process.env.PORT || 5001;

/**
 * Demo Account Logic: Ensures a test user exists for competition judges/testing
 */
const createTestUser = async () => {
  try {
    const testEmail = "testuser@loanhook.app";
    let user = await User.findOne({ email: testEmail });

    if (!user) {
      const hashedPassword = await bcrypt.hash("testpassword123", 10);
      user = await User.create({
        fullName: "Demo User",
        email: testEmail,
        password: hashedPassword
      });
      console.log("Demo account created: testuser@loanhook.app");
    }

    const existingProfile = await ApplicantProfile.findOne({ userId: user._id });
    if (!existingProfile) {
      const applicantData = generateApplicant(user.fullName);
      await ApplicantProfile.create({
        userId: user._id,
        ...applicantData
      });
      console.log("✅ Demo account profile created");
    }
  } catch (error) {
    console.error("Error creating test user:", error);
  }
};

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await createTestUser();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Base Route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// API Routes
app.use('/api/finance', financeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatrouter);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});