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
        message: "Video Id already exists",
        statusCode: 400,
      });
    }

    const createdIslamicLecture = await IslamicLecture.create(
      islamicLectureInfo
    );

    const { _id: createdLectureId, lecturer } = createdIslamicLecture;
    const lecturerId = lecturer;

    const foundLecturer = await Lecturer.findById(lecturerId);

    if (!foundLecturer) {
      return res
        .status(404)
        .json({ message: "Lecturer not found", statusCode: 404 });
    }

    foundLecturer.lectures.push(createdLectureId);

    await foundLecturer.save();

    return res.json({
      id: createdLectureId,
      statusCode: 200,
      message: `Successfully created the  ${islamicLectureInfo.type}`,
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

const getIslamicLecturesByTypeAndLecturerId = async (req, res) => {
  const { lecturerId } = req.params;

  try {
    let lectures;

    // if (!type && !lecturerId) {
    //   return res
    //     .status(400)
    //     .json({ message: "Type and lecturerId are required", statusCode: 400 });
    // }

    lectures = await IslamicLecture.find({
      type: "lecture",
      lecturer: lecturerId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "lecturer",
        select: "_id name lecturerId image",
      });

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
      return res
        .status(404)
        .json({ message: "Islamic Lecture not found", statusCode: 404 });
    }

    if (
      updatedIslamicLectureInfo.videoId &&
      updatedIslamicLectureInfo.videoId !== existingIslamicLecture.videoId
    ) {
      const duplicateVideoId = await IslamicLecture.findOne({
        videoId: updatedIslamicLectureInfo.videoId,
      });

      if (duplicateVideoId) {
        return res.status(400).json({
          message: "VideoId already exists",
          statusCode: 400,
        });
      }
    }

    // Object.assign(existingIslamicLecture, updatedIslamicLectureInfo);
    // await existingIslamicLecture.save();

    const updatedCourse = await IslamicLecture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      data: updatedCourse._id,
      statusCode: 200,
      message: "Islamic Lecture Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};

const deleteIslamicLectureById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIslamicLecture = await IslamicLecture.findByIdAndDelete(id);

    if (!deletedIslamicLecture) {
      return res.status(404).json({ error: "Islamic Lecture not found" });
    }

    const lecturerId = deletedIslamicLecture.lecturer;
    const foundLecturer = await Lecturer.findById(lecturerId);

    if (!foundLecturer) {
      return res.status(404).json({ error: "Lecturer not found" });
    }

    foundLecturer.lectures = foundLecturer.lectures.filter(
      (lecture) => lecture.toString() !== id
    );

    await foundLecturer.save();

    return res.json({
      id,
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
  getIslamicLecturesByTypeAndLecturerId,
  deleteIslamicLectureById,
};
