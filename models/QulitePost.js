const mongoose = require("mongoose");

const qlitePostSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoContent: {
    videoDuration: {
      type: String,
    },
    videoId: {
      type: String,
    },
  },
  title: {
    type: String,
  },
  postInfo: {
    type: String,
    required: true,
  },
  publishingDate: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  reactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reaction",
    },
  ],
});

const QlitePost = mongoose.model("QlitePost", qlitePostSchema);

module.exports = QlitePost;
