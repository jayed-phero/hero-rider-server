const { ObjectId } = require("mongoose").Types;
const { authenticate } = require("../milldeware/jwtverify");
const Comment = require("../models/Comments");
const QlitePost = require("../models/QulitePost");
const Reaction = require("../models/Reactions");

// GET: Retrieve all QlitePosts
const getAllQlitePosts = async (req, res) => {
  try {
    const qlitePosts = await QlitePost.find()
      .populate({
        path: "author",
        select: "username email username role",
      })
      .populate("comments reactions");

    res.json(qlitePosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET: Retrieve a specific QlitePost by ID
const getQlitePostById = async (req, res) => {
  const postId = req.params.id;

  try {
    const qlitePost = await QlitePost.findById(postId)
      .populate({
        path: "author",
        select: "username email username role",
      })
      .populate("comments reactions");

    if (!qlitePost) {
      return res.status(404).json({ error: "QlitePost not found" });
    }

    res.json(qlitePost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST: Create a new QlitePost
const createQlitePost = async (req, res) => {
  const { author, content, images } = req.body;

  try {
    const newQlitePost = new QlitePost({
      author,
      content,
      images,
    });

    const savedPost = await newQlitePost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT: Update a specific QlitePost by ID
const updateQlitePostById = async (req, res) => {
  const postId = req.params.id;
  const updateFields = req.body;

  try {
    const updatedQlitePost = await QlitePost.findByIdAndUpdate(
      postId,
      { $set: updateFields },
      { new: true }
    )
      .populate({
        path: "author",
        select: "username email username role",
      })
      .populate("comments reactions");

    if (!updatedQlitePost) {
      return res.status(404).json({ error: "QlitePost not found" });
    }

    res.json(updatedQlitePost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE: Delete a specific QlitePost by ID
const deleteQlitePostById = async (req, res) => {
  const postId = req.params.id;

  try {
    // Check if the post with the specified ID exists
    const existingQlitePost = await QlitePost.findById(postId);

    if (!existingQlitePost) {
      return res.status(404).json({ error: "QlitePost not found" });
    }

    existingQlitePost.deleted = true;
    const deletedQlitePost = await existingQlitePost.save();

    res.json({ message: "QlitePost deleted successfully", deletedQlitePost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const toggleReaction = async (req, res) => {
  const postId = req.params.postId;
  console.log("user data", req.user);
  const userId = req.user._id;
  const { reactionType } = req.body;

  try {
    // Find the post
    const post = await QlitePost.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "QlitePost not found" });
    }

    // Find the user's existing reaction for the post
    const existingReaction = await Reaction.findOne({
      author: userId,
      qlitePostId: postId,
    });

    // If the user has an existing reaction of the same type, remove it
    if (existingReaction && existingReaction.reactionType === reactionType) {
      await Reaction.deleteOne({
        _id: existingReaction._id,
      });
      post.reactions.pull(existingReaction._id);
    } else {
      // If the user has a different reaction, update it to the new type
      if (existingReaction) {
        existingReaction.reactionType = reactionType;
        await existingReaction.save();
      } else {
        // If the user has no existing reaction, create a new one
        const newReaction = new Reaction({
          author: userId,
          qlitePostId: postId,
          reactionType: reactionType,
        });
        await newReaction.save();
        post.reactions.push(newReaction);
      }
    }

    // Update share count (assuming you want to increment it when a reaction is added)
    post.shareCount = post.reactions.length;

    // Save the updated post
    await post.save();

    res.json({ success: true, message: "Reaction toggled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST: Share a QlitePost
const shareQlitePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the original post
    const originalPost = await QlitePost.findById(postId);

    if (!originalPost) {
      return res.status(404).json({ error: "QlitePost not found" });
    }

    // Update the share count of the original post
    originalPost.shareCount += 1;
    await originalPost.save();

    res.status(200).json({ shareCount: originalPost.shareCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createQlitePost,
  getAllQlitePosts,
  getQlitePostById,
  updateQlitePostById,
  deleteQlitePostById,
  toggleReaction,
  shareQlitePost,
};
