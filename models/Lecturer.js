const mongoose = require("mongoose");

const lecturerSchema = new mongoose.Schema({
  lecturerId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Lecturer = mongoose.model("Lecturer", lecturerSchema);

module.exports = Lecturer;
