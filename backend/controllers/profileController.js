import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';
import Profile from "../models/Profile.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];
const OCCUPATIONS = ["Student", "Unemployed", "Salaried", "Self-Employed", "Farmer", "Daily Wage Laborer", "Retired", "Other"];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];

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

// POST /api/profile/extract
export const extractProfileFromText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'text is required' });
    }

   const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are extracting structured profile fields from a person's free-text self-description, for an Indian government scheme eligibility platform.

Extract these fields if mentioned. If a field is not mentioned or unclear, use null for it — do not guess.

- age: number (the person's age in years, if stated or clearly implied)
- income: number (annual income in INR, if stated. Convert "lakh" to actual number, e.g. "5 lakh" = 500000)
- state: must be EXACTLY one of this list, or null: ${JSON.stringify(STATES)}
- occupation: must be EXACTLY one of this list, or null: ${JSON.stringify(OCCUPATIONS)}
- category: must be EXACTLY one of this list, or null: ${JSON.stringify(CATEGORIES)}
- disabilityStatus: true or false. Use false unless a disability is explicitly mentioned.

Respond with ONLY a raw JSON object, no markdown code fences, no explanation, no extra text. Example shape:
{"age": 22, "income": 250000, "state": "Odisha", "occupation": "Student", "category": "General", "disabilityStatus": false}

Text to extract from:
"""${text}"""`;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    const cleaned = rawResponse.replace(/```json|```/g, '').trim();

    let extracted;
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ message: 'Failed to parse extraction result. Please try rephrasing.' });
    }

    res.status(200).json(extracted);
  } catch (error) {
    res.status(500).json({ message: 'Extraction failed', error: error.message });
  }
};