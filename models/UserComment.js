const mongoose = require("mongoose");

const userCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserComment = mongoose.model("UserComment", userCommentSchema);

module.exports = UserComment;
