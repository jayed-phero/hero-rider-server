// users.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authMiddleware = require("../milldeware/jwtverify");

// Define routes for users
router.post("/register", userController.register);
router.post("/verify-account", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.put("/update-password", userController.updatePassword);

router.get("/profile", authMiddleware, (req, res) => {
  // Access the current user
  const currentUser = req.user;
  res.json({ user: currentUser });
});

module.exports = router;
