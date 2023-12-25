// masyalas.routes.js
const express = require("express");
const router = express.Router();
const islamicLectureController = require("../controller/islamiclecture.controller");

// Define routes for masyalas
router.post("/", islamicLectureController.createIslamicLecture);
router.get("/:type", islamicLectureController.getIslamicLecturesByType);

module.exports = router;
