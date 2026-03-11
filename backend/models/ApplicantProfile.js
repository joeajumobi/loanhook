import mongoose from 'mongoose';

const applicantProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  applicantId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  savings: {
    type: Number,
    required: true
  },
  housing: {
    type: Number,
    required: true
  },
  food: {
    type: Number,
    required: true
  },
  transport: {
    type: Number,
    required: true
  },
  utilities: {
    type: Number,
    required: true
  },
  other: {
    type: Number,
    required: true
  },
  debt: {
    type: Number,
    required: true
  }
});

export default mongoose.model('ApplicantProfile', applicantProfileSchema);