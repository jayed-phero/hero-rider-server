const express = require("express");

// import {
//   createCourse,
//   deleteCourseById,
//   getAllCourses,
//   getCourseById,
//   updateCourseById,
// } = require("../controller/course.controller");

const courseRoutes = require("../controller/course.controller");
const { authMiddleware } = require("../milldeware/authenticate");

const router = express.Router();

// GET all courses
router.get("/", courseRoutes.getAllCourses);

// GET a single course by ID
router.get("/getone/:id", courseRoutes.getCourseById);

// GET course selection data
router.get("/getcoursedata", courseRoutes.getCoursesSelectionData);

// POST create a new course
router.post("/create", courseRoutes.createCourse);

// PUT update a course by ID
router.patch("/update/:id", courseRoutes.updateCourseById);

// POST create a new course
router.post("/enroll", authMiddleware, courseRoutes.enrolledCourseByUserId);

// DELETE delete a course by ID
router.delete("/delete/:id", courseRoutes.deleteCourseById);

module.exports = router;
