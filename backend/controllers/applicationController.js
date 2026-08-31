import Application from '../models/Application.js';

export async function createApplication(req, res) {
  try {
    const { schemeId, status, reminderDate, notes } = req.body;

    if (!schemeId) {
      return res.status(400).json({ message: 'schemeId is required' });
    }

    const application = await Application.create({
      userId: req.user.id,
      schemeId,
      status,
      reminderDate,
      notes,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already saved this scheme.' });
    }
    res.status(500).json({ message: err.message || 'Failed to save scheme' });
  }
}

export async function getMyApplications(req, res) {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('schemeId', 'schemeName provider description')
      .sort({ updatedAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch applications' });
  }
}

export async function updateApplication(req, res) {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const { status, reminderDate, notes } = req.body;
       if (status !== undefined) application.status = status;
    if (reminderDate !== undefined) {
      application.reminderDate = reminderDate;
      application.reminderSentAt = null; // reset so a new/changed date can trigger again
    }
    if (notes !== undefined) application.notes = notes;
    await application.save();
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update application' });
  }
}

export async function deleteApplication(req, res) {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await application.deleteOne();
    res.status(200).json({ message: 'Application removed' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete application' });
  }
}