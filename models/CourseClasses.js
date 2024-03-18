const mongoose = require("mongoose");

// Define the schema for the Class collection
const courseClassesSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 11,
    },
    videoDuration: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Class model
const CourseClasses = mongoose.model("CourseClasses", courseClassesSchema);

module.exports = CourseClasses;
