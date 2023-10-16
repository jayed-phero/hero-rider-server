// lectures.routes.js
const express = require("express");
const router = express.Router();
const lectureController = require("../controllers/lecture.controller");

// Define routes for lectures
router.post("/", lectureController.createLecture);
router.get("/lecturers", lectureController.getLecturers);
router.get("/:lecturerId", lectureController.getLecturesByLecturerId);

module.exports = router;
