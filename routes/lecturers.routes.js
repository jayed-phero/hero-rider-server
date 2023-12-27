// lecturers.routes.js
const express = require("express");
const router = express.Router();
const lecturerController = require("../controller/lecturer.controller");

// Define routes for lecturers
router.get("/", lecturerController.getLecturersWithCounts);
router.get("/info", lecturerController.getLecturersInfo);
router.get("/:lecturerId", lecturerController.getLecturesByLecturer);

module.exports = router;
