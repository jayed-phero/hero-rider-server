// masyalas.routes.js
const express = require("express");
const router = express.Router();
const islamicLectureController = require("../controller/islamiclecture.controller");

// Define routes for masyalas

router.get("/getone/:id", islamicLectureController.getIslamicLectureById);
router.post("/create", islamicLectureController.createIslamicLecture);

router.patch("/update/:id", islamicLectureController.updateIslamicLecture);

router.get("/delete/:id", islamicLectureController.deleteIslamicLectureById);

router.get("/types/:type", islamicLectureController.getIslamicLecturesByType);

router.get(
  "/getlecture/:lecturerId",
  islamicLectureController.getIslamicLecturesByTypeAndLecturerId
);

module.exports = router;
