import Scheme from '../models/Scheme.js';

export const createScheme = async (req, res) => {
  try {
    const {
      schemeName,
      description,
      provider,
      minAge,
      maxAge,
      maxIncome,
      states,
      occupation,
      category,
      disabilityRequired,
    } = req.body;

    const scheme = await Scheme.create({
      schemeName,
      description,
      provider,
      minAge,
      maxAge,
      maxIncome,
      states,
      occupation,
      category,
      disabilityRequired,
    });

    res.status(201).json({ scheme });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};