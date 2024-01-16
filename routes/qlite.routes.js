const express = require("express");
const router = express.Router();
const qlitePostController = require("../controller/qlite.controller");
const { authMiddleware } = require("../milldeware/authenticate");

router.get("/", qlitePostController.getAllQlitePosts);

// GET: Retrieve a specific QlitePost by ID
router.get("/getone/:id", qlitePostController.getQlitePostById);

// PUT: Update a specific QlitePost by ID
router.patch("/update/:id", qlitePostController.updateQlitePostById);

// DELETE: Delete a specific QlitePost by ID
router.delete("/delete/:id", qlitePostController.deleteQlitePostById);

// // POST: Toggle share for a QlitePost
// router.post('/:id/share/toggle', shareController.toggleShare);

router.post(
  "/reaction/:postId",
  authMiddleware,
  qlitePostController.toggleReaction
);

router.post("/create", qlitePostController.createQlitePost);

router.post(
  "/share/:postId",
  authMiddleware,
  qlitePostController.shareQlitePost
);

// Comment on a QlitePost
// router.post(
//   "/:postId/comment",
//   // authMiddleware,
//   qlitePostController.commentOnQlitePost
// );

// // Get posts for a specific user
// router.get("/:userId/posts", qlitePostController.getUserPosts);

// Create a new QlitePost

module.exports = router;
