import express from 'express';
import ApplicantProfile from '../models/ApplicantProfile.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const profile = await ApplicantProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ error: 'No applicant data available for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;