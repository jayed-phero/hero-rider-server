const express = require("express");
const router = express.Router();
const qlitePostController = require("../controller/qlite.controller");
const { authMiddleware } = require("../milldeware/jwtverify");

// Like a QlitePost
router.post("/:postId/reaction",
  //  authMiddleware,
  qlitePostController.toggleReaction);

// Comment on a QlitePost
router.post(
  "/:postId/comment",
  // authMiddleware,
  qlitePostController.commentOnQlitePost
);

// Get posts for a specific user
router.get("/:userId/posts", qlitePostController.getUserPosts);

// Create a new QlitePost
router.post("/create", qlitePostController.createQlitePost);

// Other QlitePost routes...

module.exports = router;
