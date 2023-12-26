// masyalas.routes.js
const express = require("express");
const router = express.Router();
const islamicLectureController = require("../controller/islamiclecture.controller");

// Define routes for masyalas

router.get("/getone/:id", islamicLectureController.getIslamicLectureById);
router.post("/", islamicLectureController.createIslamicLecture);

router.patch("/update/:id", islamicLectureController.updateIslamicLecture);

router.get("/types/:type", islamicLectureController.getIslamicLecturesByType);

module.exports = router;
