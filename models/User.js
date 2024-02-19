const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");
const { roles } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    role: {
      type: String,
      enum: [roles.user, roles.amdin],
      required: true,
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    registeredUserId: {
      type: String,
    },
    confirmationToken: String,
    confirmationTokenExpirse: Date,
    passwordChangedAt: Date,
    passwordRestToken: String,
    passwordResetExpirse: Date,
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, {
  message: "The {PATH} is already taken, please choose another.",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
