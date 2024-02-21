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
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "pending", "canceled"],
      default: "pending",
      required: true,
    },
    payment: {
      transactionId: String,
      status: String,
      amount: Number,
    },
    paymentMethods: {
      type: String,
      enum: ["nagad", "rocket"],
    },
    transactionId: {
      type: String,
    },
    paymentMobileNumber: {
      type: String,
    },
    duration: {
      startDate: Date,
      endDate: Date,
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
      required: true,
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
