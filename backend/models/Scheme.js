import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
      trim: true,
    },
    minAge: {
      type: Number,
      default: 0,
    },
    maxAge: {
      type: Number,
      default: 120,
    },
    maxIncome: {
      type: Number,
      default: Infinity,
    },
    states: {
      type: [String],
      default: ['All'],
    },
    occupation: {
      type: [String],
      default: ['All'],
    },
    category: {
      type: [String],
      default: ['All'],
    },
    disabilityRequired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;