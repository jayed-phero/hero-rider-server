// qlitePost.model.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const reactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const qlitePostSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  lecturer: {
    type: String,
    required: true,
  },
  videoDuration: {
    type: String,
    required: true,
  },
  lecturerId: {
    type: String,
    required: true,
  },
  publishingDate: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [commentSchema],
  reactions: [reactionSchema], // Include reactions directly in the schema
});

const QlitePost = mongoose.model("QlitePost", qlitePostSchema);

module.exports = QlitePost;
