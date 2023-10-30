// lecturer.controller.js
// const Lecturer = require("../models/Lecturer");

// const getLecturers = async (req, res) => {
//   try {
//     const lecturers = await Lecturer.find().exec();
//     res.json(lecturers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   getLecturers,
// };


const Lecture = require("../models/Lecture");
const Lecturer = require("../models/Lecturer");

const getLecturersWithCounts = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().exec();
    const lecturersWithCounts = [];

    for (const lecturer of lecturers) {
      const lecturerId = lecturer.lecturerId;

      const lectureCount = await Lecture.countDocuments({
        lecturerId,
      });

      lecturersWithCounts.push({
        lecturerId: lecturer.lecturerId,
        name: lecturer.name,
        image: lecturer.image,
        lectureCount: lectureCount,
      });
    }

    res.json(lecturersWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getLecturesByLecturer = async (req, res) => {
  const { lecturerId } = req.params;

  try {
    const lectures = await Lecture.find({ lecturerId })
      .sort({ _id: -1 })
      .exec();

    res.json(lectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  getLecturersWithCounts,
  getLecturesByLecturer
};

