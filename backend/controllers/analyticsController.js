import User from '../models/User.js';
import Scheme from '../models/Scheme.js';
import Profile from '../models/Profile.js';
import Application from '../models/Application.js';
import Document from '../models/Document.js';
import Report from '../models/Report.js';

export async function getAnalytics(req, res) {
  try {
    const [totalUsers, totalSchemes, totalProfiles, totalDocuments] = await Promise.all([
      User.countDocuments(),
      Scheme.countDocuments(),
      Profile.countDocuments(),
      Document.countDocuments(),
    ]);

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const topSchemes = await Application.aggregate([
      { $group: { _id: '$schemeId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'schemes',
          localField: '_id',
          foreignField: '_id',
          as: 'scheme',
        },
      },
      { $unwind: '$scheme' },
      {
        $project: {
          _id: 0,
          schemeName: '$scheme.schemeName',
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      totalUsers,
      totalSchemes,
      totalProfiles,
      totalDocuments,
      applicationsByStatus,
      reportsByStatus,
      topSchemes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch analytics' });
  }
}