const express = require("express");
const router = express.Router();
const qlitePostController = require("../controller/qlite.controller");
const { authenticate } = require("../middlewares/auth");

// Like a QlitePost
router.post("/:postId/like", authenticate, qlitePostController.likeQlitePost);

// Comment on a QlitePost
router.post(
  "/:postId/comment",
  authenticate,
  qlitePostController.commentOnQlitePost
);

// Get posts for a specific user
router.get("/:userId/posts", qlitePostController.getUserPosts);

// Create a new QlitePost
router.post("/create", authenticate, qlitePostController.createQlitePost);

// Other QlitePost routes...

module.exports = router;
