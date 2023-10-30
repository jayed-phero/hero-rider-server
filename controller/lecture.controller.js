// lecture.controller.js
const Lecture = require("../models/Lecture");

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

module.exports = {
  createLecture,
};
