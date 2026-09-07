import Report from '../models/Report.js';

export async function createReport(req, res) {
  try {
    const { schemeId, reason, details } = req.body;

    if (!schemeId || !reason) {
      return res.status(400).json({ message: 'schemeId and reason are required' });
    }

    const report = await Report.create({
      userId: req.user.id,
      schemeId,
      reason,
      details,
    });

    res.status(201).json(report);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reported this scheme.' });
    }
    res.status(500).json({ message: err.message || 'Failed to submit report' });
  }
}

export async function getAllReports(req, res) {
  try {
    const reports = await Report.find()
      .populate('userId', 'name email')
      .populate('schemeId', 'schemeName provider')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch reports' });
  }
}

export async function updateReportStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['Pending', 'Reviewed', 'Dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update report' });
  }
}