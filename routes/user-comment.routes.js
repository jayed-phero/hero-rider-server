const express = require("express");
const router = express.Router();
const userCommentController = require("../controller/user-comment.controller");

// Route to create a new user comment
router.post("/comments", userCommentController.createComment);

// Route to get all user comments
router.get("/", userCommentController.getAllComments);

// Add more routes as needed for updating and deleting comments

module.exports = router;
