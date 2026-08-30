import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    docType: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// One document per type per user — enforces the "vault" pattern at the DB level
documentSchema.index({ userId: 1, docType: 1 }, { unique: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;