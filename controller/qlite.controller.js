const { ObjectId } = require("mongoose").Types;
const { authenticate } = require("../milldeware/jwtverify");
const Comment = require("../models/Comments");
const QlitePost = require("../models/QulitePost");
const Reaction = require("../models/Reactions");

// Create a new QlitePost
const createQlitePost = async (req, res) => {
  const postData = req.body;
  // postData.userID = req.user.id;

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
      { _id: mongoose.Types.ObjectId(postId) },
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
  // const userId = req.body.userId;
  const commentData = req.body;
  console.log(req.params);

  try {
    // Create a new comment
    const newComment = new Comment({
      userId: commentData.userId,
      text: commentData.text,
      type: commentData.type,
      qlitePostId: postId,
    });

    const savedComment = await newComment.save();

    await QlitePost.findByIdAndUpdate(postId, {
      $addToSet: { comments: savedComment._id },
    });

    res.json({
      status: "success",
      comment: savedComment.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user posts with comments and reactions
const getUserPosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userPosts = await QlitePost.find({ userID: userId }).populate(
      "comments reactions"
    );

    res.json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const toggleReaction = async (req, res) => {
  try {
    const { userId, type, qlitePostId } = req.body;

    // Check if the post exists
    const qlitePost = await QlitePost.findById(qlitePostId);
    if (!qlitePost) {
      return res.status(404).json({ error: "Qlite post not found" });
    }

    const existingReaction = await Reaction.findOne({ userId, qlitePostId });

    if (existingReaction) {
      await Reaction.deleteOne({ _id: existingReaction._id });

      await QlitePost.updateOne(
        { _id: qlitePostId },
        { $pull: { reactions: existingReaction._id } }
      );

      res.json({ message: "Reaction deleted successfully", type: null });
    } else {
      const newReaction = new Reaction({
        userId,
        type,
        qlitePostId,
      });

      const savedReaction = await newReaction.save();

      await QlitePost.updateOne(
        { _id: qlitePostId },
        { $addToSet: { reactions: savedReaction._id } }
      );

      res
        .status(201)
        .json({
          message: "Reaction added successfully",
          type: savedReaction.type,
        });
    }
  } catch (error) {
    console.error("Error toggling reaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createQlitePost,
  likeQlitePost,
  commentOnQlitePost,
  getUserPosts,
  toggleReaction,
};
