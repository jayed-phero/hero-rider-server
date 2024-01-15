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
  const { user, type, target } = req.body;

  try {
    // Check if the QlitePost or Comment (based on targetModel) exists
    const targetType = target.targetModel; // 'QlitePost' or 'Comment'
    const targetObject = await mongoose
      .model(targetType)
      .findById(target.targetId);

    if (!targetObject) {
      return res.status(404).json({ error: `${targetType} not found` });
    }

    // Check if the user has already reacted to this target
    const existingReaction = await Reaction.findOne({ user, target });

    if (existingReaction) {
      // If the user has already reacted, remove the reaction
      await Reaction.findByIdAndRemove(existingReaction._id);

      // Remove the reference from the QlitePost or Comment
      targetObject.reactions.pull(existingReaction._id);
      await targetObject.save();

      res.json({ message: "Reaction removed", type, target });
    } else {
      // If the user has not reacted, create a new reaction
      const newReaction = new Reaction({
        user,
        type,
        target,
      });

      const savedReaction = await newReaction.save();

      // Update QlitePost or Comment with the new reaction
      targetObject.reactions.push(savedReaction._id);
      await targetObject.save();

      res.status(201).json({ message: "Reaction added", type, target });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const toggleShare = async (req, res) => {
  const { user, target } = req.body;

  try {
    // Check if the QlitePost exists
    const targetObject = await QlitePost.findById(target);

    if (!targetObject) {
      return res.status(404).json({ error: "QlitePost not found" });
    }

    // Check if the user has already shared this post
    const existingShare = await Share.findOne({ user, target });

    if (existingShare) {
      // If the user has already shared, remove the share
      await Share.findByIdAndRemove(existingShare._id);

      // Update QlitePost with the removed share
      targetObject.shareCount -= 1;
      await targetObject.save();

      res.json({ message: "Share removed", target });
    } else {
      // If the user has not shared, create a new share
      const newShare = new Share({
        user,
        target,
      });

      const savedShare = await newShare.save();

      // Update QlitePost with the new share
      targetObject.shareCount += 1;
      await targetObject.save();

      res.status(201).json({ message: "Share added", target });
    }
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
};
