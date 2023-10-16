// lecturer.controller.js
const Lecturer = require("../models/lecturer.model");

const getLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().exec();
    res.json(lecturers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getLecturers,
};
