const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");
const UserRoles = require("../constants/user");

const userSchema = new mongoose.Schema({
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
    required: true,
  },
  role: {
    type: String,
    enum: [UserRoles.user, UserRoles.amdin],
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
});

userSchema.plugin(uniqueValidator, {
  message: "The {PATH} is already taken, please choose another.",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
