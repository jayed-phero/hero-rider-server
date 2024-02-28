// controllers/qliteStoryController.js
const QliteStory = require("../models/QliteStory");

async function createQliteStory(req, res) {
  const id = req.user._id;
  const storyData = { ...req.body, author: id };
  try {
    // Check if the image already exists
    const existingQliteStory = await QliteStory.findOne({
      storyImage: req.body.storyImage,
    });

    if (existingQliteStory) {
      return res.status(400).json({
        statusCode: 400,
        error: "Bad Request",
        message: "This image already exists in a story",
      });
    }

    // If the image doesn't exist, create the new QliteStory
    const qliteStory = await QliteStory.create(storyData);
    return res.status(200).json({
      statusCode: 200,
      data: qliteStory,
      message: "Successfully created story",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all QliteStories
async function getAllQliteStories(req, res) {
  try {
    const qliteStories = await QliteStory.find().sort({ createdAt: -1 });
    return res.json({ statusCode: 200, data: qliteStories });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a single QliteStory by ID
async function getQliteStoryById(req, res) {
  try {
    const qliteStory = await QliteStory.findById(req.params.id);
    if (!qliteStory) {
      return res.status(404).json({ error: "QliteStory not found" });
    }
    return res.json(qliteStory);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a QliteStory by ID
async function updateQliteStory(req, res) {
  try {
    const qliteStory = await QliteStory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!qliteStory) {
      return res.status(404).json({ error: "QliteStory not found" });
    }
    return res.json(qliteStory);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a QliteStory by ID
async function deleteQliteStory(req, res) {
  try {
    const qliteStory = await QliteStory.findByIdAndDelete(req.params.id);
    if (!qliteStory) {
      return res.status(404).json({ error: "QliteStory not found" });
    }
    return res.json({ message: "QliteStory deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createQliteStory,
  getAllQliteStories,
  getQliteStoryById,
  updateQliteStory,
  deleteQliteStory,
};
