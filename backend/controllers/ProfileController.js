import Profile from "../models/Profile.js";

// GET /api/profile/me
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found. Please create one." });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/profile/me  (creates if it doesn't exist, updates if it does)
export const upsertMyProfile = async (req, res) => {
  try {
    const { dateOfBirth, income, state, occupation, category, disabilityStatus } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, dateOfBirth, income, state, occupation, category, disabilityStatus },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ message: "Invalid profile data", error: error.message });
  }
};