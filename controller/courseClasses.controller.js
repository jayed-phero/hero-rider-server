const { default: mongoose } = require("mongoose");
const CourseClasses = require("../models/CourseClasses");
const Course = require("../models/Course");

// create course class
const createCourseClass = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if a class with the same title already exists
    const existingClass = await CourseClasses.findOne({ title });

    if (existingClass) {
      return res.status(400).json({
        statusCode: 400,
        message: "Class with the same title already exists",
      });
    }

    // If the title doesn't exist, create a new class document
    const newClass = new CourseClasses(req.body);

    // Save the new class document to the database
    const savedClass = await newClass.save();

    res.status(201).json({
      statusCode: 200,
      id: savedClass._id,
      message: "Class created successfully",
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

// Controller function to get all classes for a specific course
const getClassesForCourse = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId } = req.params;

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    // Check if the courseId exists in the database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is enrolled in the course
    const isEnrolled = req.user.enrolledCourses.includes(courseId);
    if (!isEnrolled) {
      return res
        .status(403)
        .json({ message: "Forbidden: User is not enrolled in the course" });
    }

    // Find all classes for the specified course
    const classes = await CourseClasses.find({ courseId }).populate({
      path: "courseId",
      select: "title",
    });

    res.status(200).json({ statusCode: 200, data: classes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to update a class
const updateCourseClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl, videoDuration } = req.body;

    // Find the class by ID and update its fields
    const updatedClass = await CourseClasses.findByIdAndUpdate(
      id,
      {
        title,
        description,
        videoUrl,
        videoDuration,
      },
      { new: true }
    );

    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a class
const deleteCourseClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the class by ID and delete it
    await CourseClasses.findByIdAndDelete(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteCourseClass,
  createCourseClass,
  getClassesForCourse,
  updateCourseClass,
};
