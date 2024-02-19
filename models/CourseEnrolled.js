const mongoose = require("mongoose");

const courseEnrolledSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    status: {
      type: String,
      enum: ["active", "completed", "pending", "canceled"],
      default: "pending",
    },
    payment: {
      transactionId: String,
      status: String,
      amount: Number,
    },
    duration: {
      startDate: Date,
      endDate: Date,
    },
    metadata: {
      enrollmentSource: String,
    },
  },
  {
    timestamps: true,
  }
);

courseEnrolledSchema.methods.isUserEnrolled = function (courseId) {
  return this.courseId.includes(courseId);
};

const CourseEnrolled = mongoose.model("CourseEnrolled", courseEnrolledSchema);

module.exports = CourseEnrolled;
