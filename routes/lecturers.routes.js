// lecturers.routes.js
const express = require("express");
const router = express.Router();
const lecturerController = require("../controllers/lecturer.controller");

// Define routes for lecturers
router.get("/", lecturerController.getLecturers);

module.exports = router;
