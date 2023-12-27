// masyala.controller.js
const IslamicLecture = require("../models/IslamicLecture");
const Lecturer = require("../models/Lecturer");

const createIslamicLecture = async (req, res) => {
  const islamicLectureInfo = req.body;

  try {
    const existingIslamicLecture = await IslamicLecture.findOne({
      videoId: islamicLectureInfo.videoId,
    });

    if (existingIslamicLecture) {
      return res.status(400).json({
        error: "Islamic Lecture with the same title already exists",
      });
    }

    const createdIslamicLecture = await IslamicLecture.create(
      islamicLectureInfo
    );

    const { _id: createdLectureId, lecturer } = createdIslamicLecture;
    const lecturerId = lecturer;

    const foundLecturer = await Lecturer.findById(lecturerId);

    if (!foundLecturer) {
      return res.status(404).json({ error: "Lecturer not found" });
    }

    foundLecturer.lectures.push(createdLectureId);

    await foundLecturer.save();

    return res.json({
      id: createdLectureId,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getIslamicLecturesByType = async (req, res) => {
  const { type } = req.params;

  try {
    let lectures;

    lectures = await IslamicLecture.find({ type })
      .sort({ createdAt: -1 })
      .populate({
        path: "lecturer",
        select: "_id name lecturerId image",
      });

    // if (type === "jummaLiveSharyeSolution") {
    //   lectures = await IslamicLecture.find({ type })
    //     .sort({ episode: -1 })
    //     .populate({
    //       path: "lecturer",
    //       select: "_id name lecturerId image",
    //     });
    // } else {
    //   lectures = await IslamicLecture.find({ type })
    //     .sort({ createdAt: 1 })
    //     .populate({
    //       path: "lecturer",
    //       select: "_id name lecturerId image",
    //     });
    // }

    return res.json({
      data: lectures,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getIslamicLectureById = async (req, res) => {
  const { id } = req.params;

  try {
    const islamicLecture = await IslamicLecture.findById(id);

    if (!islamicLecture) {
      return res.status(404).json({ error: "Islamic Lecture not found" });
    }

    return res.json({
      data: islamicLecture,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateIslamicLecture = async (req, res) => {
  const { id } = req.params;
  const updatedIslamicLectureInfo = req.body;

  try {
    const existingIslamicLecture = await IslamicLecture.findById(id);

    if (!existingIslamicLecture) {
      return res.status(404).json({ error: "Islamic Lecture not found" });
    }

    // Check if the videoId is being changed to one that already exists
    if (
      updatedIslamicLectureInfo.videoId &&
      updatedIslamicLectureInfo.videoId !== existingIslamicLecture.videoId
    ) {
      const duplicateVideoId = await IslamicLecture.findOne({
        videoId: updatedIslamicLectureInfo.videoId,
      });

      if (duplicateVideoId) {
        return res.status(400).json({
          error: "Islamic Lecture with the same videoId already exists",
        });
      }
    }

    // Update existingIslamicLecture with the new information
    Object.assign(existingIslamicLecture, updatedIslamicLectureInfo);
    await existingIslamicLecture.save();

    return res.json({
      id: existingIslamicLecture._id,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createIslamicLecture,
  getIslamicLecturesByType,
  getIslamicLectureById,
  updateIslamicLecture,
};
