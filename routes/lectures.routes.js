// lectures.routes.js
const express = require("express");
const router = express.Router();
const lectureController = require("../controller/lecture.controller");

// Define routes for lectures
router.post("/create", lectureController.createLecture);
router.get("/", lectureController.getLectures);
router.get("/:lecturerId", lectureController.getLecturesByInstructorId);
router.get("/item/:lectureId", lectureController.getLectureById);
router.patch("/item/:lectureId", lectureController.updateLecture);

module.exports = router;
