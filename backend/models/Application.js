import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Under Review', 'Approved', 'Rejected'],
      default: 'Saved',
    },
    reminderDate: {
      type: Date,
      default: null,
    },
    reminderSentAt: {
     type: Date,
     default: null,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },

  },
  { timestamps: true }
);

// One record per user per scheme — enforced at the DB level
applicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;