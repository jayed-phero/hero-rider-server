// / lecturers.routes.js
const express = require("express");
const router = express.Router();
const lecturerController = require("../controller/lecturer.controller");

// Define routes for lecturers
router.get("/", lecturerController.getAllLecturers);
router.get("/info", lecturerController.getLecturersInfo);

module.exports = router;
