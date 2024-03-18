const express = require("express");
const router = express.Router();
const classesController = require("../controller/courseClasses.controller");
const { userAuthenticate } = require("../milldeware/userAuthenticate");

// GET: Retrieve a specific course based class
router.get(
  "/getclasses/:courseId",
  userAuthenticate,
  classesController.getClassesForCourse
);

// POST: Create a new class
router.post("/create", classesController.createCourseClass);

// PUT: Update a class by ID
router.put("/update/:id", classesController.updateCourseClass);

// DELETE: Delete a class by ID
router.delete("/delete/:id", classesController.deleteCourseClass);

module.exports = router;
