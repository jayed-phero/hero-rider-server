const express = require("express");

// import {
//   createCourse,
//   deleteCourseById,
//   getAllCourses,
//   getCourseById,
//   updateCourseById,
// } = require("../controller/course.controller");

const courseRoutes = require("../controller/course.controller");

const router = express.Router();

// GET all courses
router.get("/", courseRoutes.getAllCourses);

// GET a single course by ID
router.get("/getone/:id", courseRoutes.getCourseById);

// POST create a new course
router.post("/create", courseRoutes.createCourse);

// PUT update a course by ID
router.patch("/update/:id", courseRoutes.updateCourseById);

// DELETE delete a course by ID
router.delete("/delete/:id", courseRoutes.deleteCourseById);

module.exports = router;
