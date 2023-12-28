// users.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { authMiddleware } = require("../milldeware/jwtverify");
const authenticateToken = require("../milldeware/jwtverify");

// Define routes for users
router.post("/register", userController.register);

router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.put("/update-password", userController.updatePassword);

// router.get("/admin-protected-route", authenticateToken, (req, res) => {
//   // This route is protected and requires admin access
//   res.json({ msg: "Admin-protected route accessed successfully" });
// });

// router.get("/profile", authMiddleware, (req, res) => {
//   // Access the current user
//   const currentUser = req.user;
//   res.json({ user: currentUser });
// });

module.exports = router;
