const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reactionType: {
    type: String,
    enum: ["like", "dislike", "love", "happy", "sad", "angry"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  qlitePostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QlitePost",
    required: true,
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
