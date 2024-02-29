// Require necessary libraries
const mongoose = require("mongoose");

// Define HijriDate schema
const hijriDateSchema = new mongoose.Schema(
  {
    hijriDate: {
      type: String,
      required: true,
    },
    hijriMonthNumber: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["increase", "decrease"],
      required: true,
    },
    howManyDays: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },
    isUpdate: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const HijriDate = mongoose.model("HijriDate", hijriDateSchema);
module.exports = HijriDate;
