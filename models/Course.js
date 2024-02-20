// Importing required modules
const mongoose = require("mongoose");

// Define the Course schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subDescription: {
      type: String,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    videoId: { type: String },
    discount: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
    },
    studentsEnrolled: {
      type: Number,
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    feature: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ["Quran", "Science", "History", "Hadith", "History", "Programming"],
    },
  },
  {
    timestamps: true,
  }
);

// Create a Course model based on the schema
const Course = mongoose.model("Course", courseSchema);

// Export the Course model
module.exports = Course;
