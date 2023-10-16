// lecture.controller.js
const Lecture = require("../models/lecture.model");

const createLecture = async (req, res) => {
  const lectureInfo = req.body;

  try {
    const existingLecture = await Lecture.findOne({
      videoId: lectureInfo.videoId,
    });

    if (existingLecture) {
      return res
        .status(400)
        .json({ error: "Lecture with the same title already exists" });
    } else {
      const result = await Lecture.create(lectureInfo);
      return res.json({
        result: result,
        status: "success",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLecturersWithCounts = async (req, res) => {
  try {
    const lecturers = await Lecture.aggregate([
      {
        $group: {
          _id: "$lecturerId",
          name: { $first: "$lecturer" },
          image: { $first: "$lecturerImage" },
          lectureCount: { $sum: 1 },
        },
      },
    ]);

    res.json(lecturers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLecturesByLecturerId = async (req, res) => {
  const lecturerId = req.params.lecturerId;

  try {
    const lectures = await Lecture.find({ lecturerId })
      .sort({ $natural: -1 })
      .exec();

    res.json(lectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createLecture,
  getLecturersWithCounts,
  getLecturesByLecturerId,
};
