const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["like", "dislike", "love", "happy", "sad", "angry"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
