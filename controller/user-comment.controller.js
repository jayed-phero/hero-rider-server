const UserComment = require("../models/UserComment");

// Controller function to create a new user comment
const createComment = async (req, res) => {
  try {
    const comment = await UserComment.create(req.body);

    return res.status(201).json({ statusCode: 200, data: comment });
  } catch (error) {
    console.error("Error creating user comment:", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

// Controller function to get all user comments
const getAllComments = async (req, res) => {
  try {
    const comments = await UserComment.find();

    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error("Error getting user comments:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  createComment,
  getAllComments,
};
