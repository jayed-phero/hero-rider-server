// // lecture.controller.js
// const Lecture = require("../models/Lecture");

// const createLecture = async (req, res) => {
//   const lectureInfo = req.body;

//   try {
//     const existingLecture = await Lecture.findOne({
//       videoId: lectureInfo.videoId,
//     });

//     if (existingLecture) {
//       return res
//         .status(400)
//         .json({ error: "Lecture with the same title already exists" });
//     } else {
//       const result = await Lecture.create(lectureInfo);
//       return res.json({
//         result: result,
//         status: "success",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   createLecture,
// };
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
    }

    const result = await Lecture.create(lectureInfo);
    return res.json({
      result,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().sort({ $natural: -1 }).exec();
    res.json({
      lectures,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLecturesByInstructorId = async (req, res) => {
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

const getLectureById = async (req, res) => {
  const lectureId = req.params.lectureId;

  try {
    const lecture = await Lecture.findById(lectureId).exec();

    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    res.json({
      lecture,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateLecture = async (req, res) => {
  const lectureId = req.params.lectureId;
  const updatedLectureInfo = req.body;

  try {
    const existingLecture = await Lecture.findById(lectureId).exec();

    if (!existingLecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    const updatedData = await Lecture.findByIdAndUpdate(
      { _id: lectureId },
      updatedLectureInfo,
      { new: true }
    );

    res.json({
      updatedData,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteLecture = async (req, res) => {
  const lectureId = req.params.lectureId;

  try {
    const deletedLecture = await Lecture.findByIdAndDelete(lectureId).exec();

    if (!deletedLecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    res.json({
      deletedLecture,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createLecture,
  getLectures,
  getLecturesByInstructorId,
  getLectureById,
  updateLecture,
  deleteLecture,
};
