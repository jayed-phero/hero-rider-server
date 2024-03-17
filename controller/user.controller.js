const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    res.status(200).json({
      statusCode: 200,
      message: "Successfully created account.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Invalid credentials" });
    }

    const payload = {
      _id: user._id,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(200).json({
      statusCode: 200,
      data: {
        accessToken: token,
        message: "Logged in successfully",
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ statusCode: "error", message: "Internal server error" });
  }
};

// const currentUser = async (req, res) => {
//   res.json({ statusCode: 200, data: req.user });
// };

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("enrolledCourses")
      .exec();

    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    }

    res.status(200).json({ statusCode: 200, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user._id;
  const updateFields = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    }

    res.status(200).json({
      statusCode: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    const result = await User.findByIdAndUpdate(req.user.id, {
      $set: { password: hashedPassword },
    });

    res.json({ result, msg: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ msg: "Email not verified" });
    }

    // Generate a random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Store the verification code along with the user's email
    user.validationCodes.push({
      code: verificationCode,
      timestamp: Date.now(),
      expirationTime: new Date(Date.now() + 30 * 60 * 1000), // Expiration time: 30 minutes
    });

    // Save the user with the new verification code
    await user.save();

    // Send an email with the verification code
    await sendVerificationCode(email, verificationCode);

    res.json({ msg: "Verification code sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Check if the verification code is correct and not expired
    const user = await User.findOne({
      email,
      "validationCodes.code": code,
      "validationCodes.expirationTime": { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database
    user.password = hashedPassword;

    // Remove the used verification code
    user.validationCodes = user.validationCodes.filter(
      (validationCode) => validationCode.code !== code
    );

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  updatePassword,
  forgotPassword,
  resetPassword,
  currentUser,
  updateUser,
};
