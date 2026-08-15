import Scheme from '../models/Scheme.js';
import Profile from "../models/Profile.js";
import { checkEligibility } from "../utils/eligibilityEngine.js";

export const getEligibleSchemes = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Please complete your profile first." });
    }

    const allSchemes = await Scheme.find();

    const eligibleSchemes = allSchemes
      .map((scheme) => {
        const result = checkEligibility(profile, scheme);
        return { scheme, ...result };
      })
      .filter((result) => result.eligible);

    res.status(200).json({
      count: eligibleSchemes.length,
      schemes: eligibleSchemes.map((r) => r.scheme),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
export const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.status(200).json({ count: schemes.length, schemes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.status(200).json({ scheme });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.status(200).json({ scheme });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.status(200).json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
