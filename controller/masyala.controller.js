// masyala.controller.js
const Masyala = require("../models/masyala.model");

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
    res.json({
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

module.exports = {
  createMasyala,
  getMasyalas,
  getMasyalasByLecturerId,
};
