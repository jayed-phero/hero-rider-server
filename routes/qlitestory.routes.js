// routes/qliteStoryRoutes.js
const express = require("express");
const router = express.Router();

const qliteStoryController = require("../controller/qlite-story-controller");
const { authMiddleware } = require("../milldeware/authenticate");

// Route to create a new QliteStory
router.post("/create", authMiddleware, qliteStoryController.createQliteStory);

// Route to get all QliteStories
router.get("/", qliteStoryController.getAllQliteStories);

// Route to get a single QliteStory by ID
router.get("/getone/:id", qliteStoryController.getQliteStoryById);

// Route to update a QliteStory by ID
router.put("/update/:id", qliteStoryController.updateQliteStory);

// Route to delete a QliteStory by ID
router.delete("/delete/:id", qliteStoryController.deleteQliteStory);

module.exports = router;
