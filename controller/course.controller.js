const Course = require("../models/Course");

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ statusCode: 200, data: courses });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ statusCode: 200, data: course });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json({
      statusCode: 200,
      id: savedCourse._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a course by ID
const updateCourseById = async (req, res) => {
  try {
    // const { id } = req.params;
    // const courseInfo = req.body;
    // const existingCourse = await Course.findById(id);

    // if (!existingCourse) {
    //   return res.status(404).json({ error: "Course not found" });
    // }

    // Object.assign(existingCourse, courseInfo);
    // await existingCourse.save();
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ statusCode: 200, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a course by ID
const deleteCourseById = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
};
