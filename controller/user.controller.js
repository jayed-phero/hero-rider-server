const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validator = require("validator");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eyetune.islam@gmail.com",
    pass: `${process.env.MAILER_INFO}`,
  },
});

const sendVerificationCode = async (email, verificationCode) => {
  const mailOptions = {
    from: "eyetune.islam@gmail.com",
    to: email,
    subject: "Account Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject("Failed to send verification code email");
      } else {
        resolve("Verification code sent successfully");
      }
    });
  });
};

const register = async (req, res) => {
  const { email, password, username } = req.body;

  console.log(req.body);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, username });

    // Generate and save a validation code with expiration time
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Expiration time: 30 minutes
    newUser.validationCodes.push({
      code: verificationCode,
      timestamp: Date.now(),
      expirationTime,
    });

    await newUser.save();

    // Send verification code via email
    // await sendVerificationCode(email, verificationCode);

    res.json({ email, msg: "User registered successfully", status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedCode = user.validationCodes.find(
      (code) =>
        code.code === verificationCode &&
        Date.now() < new Date(code.expirationTime).getTime()
    );

    if (!storedCode) {
      let errorMsg = "Invalid verification code";

      if (!storedCode) {
        errorMsg = "Invalid verification code";
      } else if (Date.now() >= new Date(storedCode.expirationTime).getTime()) {
        errorMsg = "Verification code has expired";
      }

      return res.status(400).json({ error: errorMsg });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.validationCodes = []; // Clear verification codes

    // Remove the used and expired verification code
    // user.validationCodes.splice(storedCodeIndex, 1);

    await user.save();

    res.json({ msg: "Email verification successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ msg: "Email not verified" });
    }

    // Generate JWT token
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 10800,
    }); // 3 hours

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
  verifyEmail,
};
