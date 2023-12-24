const mongoose = require("mongoose");
const validator = require("validator");

const masyalaSchema = new mongoose.Schema({
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
  lecturer: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isLength(value, { min: 1, max: 50 }),
      message: "Lecturer name should be between 1 and 50 characters",
    },
  },
  videoDuration: {
    type: String,
    required: true,
  },
  lecturerId: {
    type: String,
    required: true,
  },
  publishingDate: {
    type: Date,
    required: true,
  },
});

const Masyala = mongoose.model("Masyala", masyalaSchema);

module.exports = Masyala;
