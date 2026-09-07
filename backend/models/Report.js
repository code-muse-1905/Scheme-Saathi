import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
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
    reason: {
      type: String,
      enum: ['Asks for payment', 'Fake scheme', 'Misleading info', 'Other'],
      required: true,
    },
    details: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Dismissed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

reportSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;