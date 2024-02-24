const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const CourseEnrolled = require("../models/CourseEnrolled");
const User = require("../models/User");

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

const enrolledCourseByUserId = async (req, res) => {
  const chekcoutData = req.body;
  const id = req.user._id;
  const enrollInfo = { ...chekcoutData, userId: id };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findById(enrollInfo.courseId).session(session);
    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .send({ statusCode: 404, message: "Course not found" });
    }

    const user = await User.findById(id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .send({ statusCode: 404, message: "User not found" });
    }

    if (user.enrolledCourses.includes(enrollInfo.courseId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({
        statusCode: 400,
        message: "User is already enrolled in this course",
      });
    }

    // const userEnrollmentsCount = await CourseEnrolled.countDocuments({
    //   userId,
    // }).session(session);

    // const serialUserId = userEnrollmentsCount + 1;

    user.enrolledCourses.push(enrollInfo.courseId);
    user.phone = enrollInfo.phone;
    user.fullName = enrollInfo.fullName;

    const enrollData = new CourseEnrolled(enrollInfo);

    await enrollData.save({ session });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({
      statusCode: 200,
      message: "Enrollment successfully done",
      // data: enrollData,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).send({ statusCode: 500, message: "Internal server error" });
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
  enrolledCourseByUserId,
};
