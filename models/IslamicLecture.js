const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");

const islamicLecture = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isLength(value, { min: 1 }),
        message: "Title should be between 1 and 50 characters",
      },
    },
    videoDuration: {
      type: String,
      required: true,
    },
    lecturer: {
      type: ObjectId,
      required: true,
      ref: "Lecturers",
    },
    publishingDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const IslamicLecture = mongoose.model("IslamicLecture", islamicLecture);

module.exports = IslamicLecture;
