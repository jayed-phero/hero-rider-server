const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");

const sharyeSolutionSchema = new mongoose.Schema({
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
  episode: {
    type: String,
    unique: true,
    required: true,
  },
});

const SharyeSolution = mongoose.model("SharyeSolution", sharyeSolutionSchema);

module.exports = SharyeSolution;
