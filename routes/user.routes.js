// users.routes.js
const express = require("express");
const router = express.Router();
const {
  currentUser,
  updatePassword,
  forgotPassword,
  login,
  register,
  resetPassword,
  updateUser,
} = require("../controller/user.controller");
const { authMiddleware } = require("../milldeware/authenticate");

// Define routes for users
router.post("/register", register);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update-password", updatePassword);
router.patch("/update/me", authMiddleware, updateUser);

router.get("/me", authMiddleware, currentUser);

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
