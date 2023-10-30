// lectures.routes.js
const express = require("express");
const router = express.Router();
const lectureController = require("../controller/lecture.controller");

// Define routes for lectures
router.post("/create", lectureController.createLecture);

module.exports = router;
