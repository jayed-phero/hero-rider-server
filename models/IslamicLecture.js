const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");

const islamicLecture = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isLength(value, { min: 1 }),
        message: "Title should be between 1 and 50 characters",
      },
      trim: true,
    },
    videoDuration: {
      type: String,
      required: true,
      trim: true,
    },
    lecturer: {
      type: ObjectId,
      required: true,
      ref: "Lecturers",
      trim: true,
    },
    publishingDate: {
      type: Date,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const IslamicLecture = mongoose.model("IslamicLecture", islamicLecture);

module.exports = IslamicLecture;
