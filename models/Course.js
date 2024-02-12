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
      min: 0,
    },
    banner: {
      type: String,
    },
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
      default: 0,
      min: 0,
      max: 5,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
    features: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ["Quran", "Science", "History"],
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
