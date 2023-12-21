// masyala.controller.js
const Masyala = require("../models/Masyala");

const createMasyala = async (req, res) => {
  const masyalaInfo = req.body;

  try {
    const existingMasyala = await Masyala.findOne({
      videoId: masyalaInfo.videoId,
    });

    if (existingMasyala) {
      return res
        .status(400)
        .json({ error: "Masyala with the same title already exists" });
    } else {
      const result = await Masyala.create(masyalaInfo);
      return res.json({
        result,
        status: "success",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMasyalas = async (req, res) => {
  try {
    const masyalas = await Masyala.find().sort({ $natural: -1 }).exec();
    res.send({
      masyalas,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMasyalasByLecturerId = async (req, res) => {
  const lecturerId = req.params.lecturerId;

  try {
    const masyalas = await Masyala.find({ lecturerId })
      .sort({ $natural: -1 })
      .exec();

    res.json(masyalas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMasyalaById = async (req, res) => {
  const masyalaId = req.params.masyalaId; // Assuming this is the _id

  try {
    const masyala = await Masyala.findById(masyalaId).exec();

    if (!masyala) {
      return res.status(404).json({ error: "Masyala not found" });
    }

    res.json({
      masyala,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMasyala = async (req, res) => {
  const masyalaId = req.params.masyalaId;
  const updatedMasyalaInfo = req.body;

  try {
    const existingMasyala = await Masyala.findById(masyalaId).exec();

    if (!existingMasyala) {
      return res.status(404).json({ error: "Masyala not found" });
    }

    existingMasyala.title = updatedMasyalaInfo.title;
    existingMasyala.lecturer = updatedMasyalaInfo.lecturer;

    const updatedMasyala = await existingMasyala.save();

    res.json({
      updatedMasyala,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createMasyala,
  getMasyalas,
  getMasyalasByLecturerId,
  getMasyalaById,
};
