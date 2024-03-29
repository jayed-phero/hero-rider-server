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
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IslamicLecture",
    },
  ],
});

const Lecturer = mongoose.model("Lecturers", lecturerSchema);

module.exports = Lecturer;
