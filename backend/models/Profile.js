import mongoose from"mongoose"
const profileSchema=new mongoose.Schema({
dateOfBirth: {
  type: Date,
  required: true,
},
income: {
  type: Number,
  required: true,
  min: [0, "Income cannot be negative"],
},
state: {
  type: String,
  required: true,
  enum: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
    "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
  ],
},
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  unique: true, // one profile per user
},
occupation: {
  type: String,
  required: true,
  enum: ["Student", "Unemployed", "Salaried", "Self-Employed", "Farmer", "Daily Wage Laborer", "Retired", "Other"],
},
category: {
  type: String,
  required: true,
  enum: ["General", "OBC", "SC", "ST", "EWS"],
},
disabilityStatus: {
  type: Boolean,
  required: true,
  default: false,
},
});

export default mongoose.model("Profile", profileSchema);