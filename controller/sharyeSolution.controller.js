// masyala.controller.js
const SharyeSolution = require("../models/SharyeSolution");

const createSharyeSolution = async (req, res) => {
  const shariyaSolutionInfo = req.body;

  try {
    const existingSharyeSolution = await SharyeSolution.findOne({
      videoId: shariyaSolutionInfo.videoId,
    });

    console.log("sharye", existingSharyeSolution);

    if (existingSharyeSolution) {
      return res
        .status(400)
        .json({ error: "Shariya Solution with the same title already exists" });
    } else {
      const result = await SharyeSolution.create(shariyaSolutionInfo);
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
// episode
const getSharyeSolutions = async (req, res) => {
  try {
    const shariyeSolution = await SharyeSolution.find()
      .populate("lecturerId")
      .sort({ episode: -1 });

    console.log("sharye", shariyeSolution);
    res.send({
      shariyeSolution,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSharyeSolutionsByLecturerId = async (req, res) => {
  const lecturerId = req.params.lecturerId;

  try {
    const SharyeSolutions = await SharyeSolution.find({ lecturerId })
      .sort({ $natural: -1 })
      .exec();

    res.json(SharyeSolutions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSharyeSolutionById = async (req, res) => {
  const sharyeSolutionId = req.params.sharyeSolutionId;
  try {
    const sharyeSolution = await sharyeSolution
      .findById(sharyeSolutionId)
      .exec();

    if (!sharyeSolution) {
      return res.status(404).json({ error: "Sharye Solution not found" });
    }

    res.json({
      sharyeSolution,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateSharyeSolution = async (req, res) => {
  const sharyeSolutionId = req.params.sharyeSolutionId;
  const updatedSharyeSolutionInfo = req.body;

  try {
    const existingSharyeSolution = await SharyeSolution.findOne(
      sharyeSolutionId
    ).exec();

    if (!existingSharyeSolution) {
      return res.status(404).json({ error: "Sharye Solution not found" });
    }
    const updatedData = await SharyeSolution.findByIdAndUpdate(
      { _id: sharyeSolutionId },
      updatedSharyeSolutionInfo,
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

module.exports = {
  createSharyeSolution,
  getSharyeSolutions,
  getSharyeSolutionsByLecturerId,
  getSharyeSolutionById,
  updateSharyeSolution,
};
