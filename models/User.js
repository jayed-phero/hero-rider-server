const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");
const ValidationCode = require("./ValidationCode");

const user = {
  email: "musa@gmail.com",
  username: "musa",
  password: "1234567890",
};

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
    // validate: {
    //   validator: (value) => {
    //     // Custom password validation with a regular expression
    //     const passwordRegex =
    //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //     return passwordRegex.test(value);
    //   },
    //   message:
    //     "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol.",
    // },
  },
  username: {
    type: String,
    required: true,
    // validate: {
    //   validator: (value) => {
    //     // Custom validation for the username (example: alphanumeric and underscores)
    //     const usernameRegex = /^[a-zA-Z0-9_]+$/;
    //     return usernameRegex.test(value);
    //   },
    //   message:
    //     "Invalid username. Only alphanumeric characters and underscores are allowed.",
    // },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  validationCodes: [ValidationCode.schema], // Embed validationCodeSchema
});

// Apply the uniqueValidator plugin to the userSchema
userSchema.plugin(uniqueValidator, {
  message: "The {PATH} is already taken, please choose another.",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
