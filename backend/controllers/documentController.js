import Document from '../models/Document.js';
import { cloudinary } from '../config/cloudinary.js';

export async function uploadDocument(req, res) {
  try {
    const { docType } = req.body;

    if (!docType) {
      return res.status(400).json({ message: 'docType is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = req.file.path;
    const publicId = req.file.filename;

    const existing = await Document.findOne({ userId: req.user.id, docType });

    if (existing) {
      // Replace: delete old file from Cloudinary, update the record
      await cloudinary.uploader.destroy(existing.publicId);
      existing.fileUrl = fileUrl;
      existing.publicId = publicId;
      await existing.save();
      return res.status(200).json(existing);
    }

    const document = await Document.create({
      userId: req.user.id,
      docType,
      fileUrl,
      publicId,
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to upload document' });
  }
}

export async function getMyDocuments(req, res) {
  try {
    const documents = await Document.find({ userId: req.user.id }).sort({ docType: 1 });
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch documents' });
  }
}

export async function deleteDocument(req, res) {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (document.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    await cloudinary.uploader.destroy(document.publicId);
    await document.deleteOne();

    res.status(200).json({ message: 'Document removed' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete document' });
  }
}