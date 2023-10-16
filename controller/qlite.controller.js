const { ObjectId } = require("mongoose").Types;
const { authenticate } = require("../middlewares/auth");
const QlitePost = require("../models/QulitePost.Model");

// Create a new QlitePost
const createQlitePost = async (req, res) => {
  const postData = req.body;
  postData.userID = req.user.id;

  try {
    const result = await QlitePost.create(postData);
    res.json({
      result: result,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like a QlitePost
const likeQlitePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    const result = await QlitePost.updateOne(
      { _id: ObjectId(postId) },
      { $addToSet: { likes: userId } }
    );

    res.json({
      result: result,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Comment on a QlitePost
const commentOnQlitePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const commentData = req.body;

  try {
    const result = await QlitePost.updateOne(
      { _id: ObjectId(postId) },
      { $push: { comments: { userId: userId, text: commentData.text } } }
    );

    res.json({
      result: result,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserPosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userPosts = await QlitePost.find({ userID: userId })
      .populate("comments.userId", "username") // Assuming you have a 'username' field in the User model
      .populate("reactions.userId", "username");

    res.json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Other QlitePost methods...

module.exports = {
  createQlitePost,
  likeQlitePost,
  commentOnQlitePost,
  getUserPosts,
  // Other exported functions...
};
