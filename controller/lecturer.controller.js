const Lecturer = require("../models/Lecturer");
const IslamicLecture = require("../models/IslamicLecture");

const getAllLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().select("-lectures -__v");
    const lecturersWithCount = await Promise.all(
      lecturers.map(async (lecturer) => {
        const count = await IslamicLecture.countDocuments({
          lecturer: lecturer._id,
          type: "lecture",
        });
        return { ...lecturer.toObject(), count };
      })
    );
    res.status(200).json(lecturersWithCount);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllLecturersWithLecture = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().populate({
      path: "lectures",
      match: { type: "lecture" },
      populate: { path: "lecturer", select: "name image" },
    });
    res.status(200).json({
      lecturers,
      status: "success",
      message: "Successfully loaded data",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLecturersInfo = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().exec();
    const lecturersInfo = [];

    for (const lecturer of lecturers) {
      lecturersInfo.push({
        value: lecturer._id,
        label: lecturer.name,
      });
    }

    console.log(lecturersInfo);

    res.json(lecturersInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllLecturersWithLecture,
  getAllLecturers,
  getLecturersInfo,
};
