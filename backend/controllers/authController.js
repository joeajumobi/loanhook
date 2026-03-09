import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // 1. Hash and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    // 2. GENERATE TOKEN (Missing this was the issue!)
    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30m' }
    );

    // 3. Send token back to the frontend
    res.status(201).json({ 
      message: "User created!",
      token: token, // Now the frontend will see this and redirect
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("DETAILED SIGNUP ERROR:", err); 
    
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
  res.json({ token });
};

export const guestLogin = async (req, res) => {
  try {
    // Look for a specific test user or create one if it doesn't exist
    let user = await User.findOne({ email: "testuser@loanhook.app" });
    
    if (!user) {
      user = new User({
        fullName: "Test User",
        email: "testuser@loanhook.app",
        password: await bcrypt.hash("testpassword123", 10)
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: "Logged in as Test User" });
  } catch (err) {
    res.status(500).json({ error: "Guest login failed" });
  }
};