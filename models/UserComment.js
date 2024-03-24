const mongoose = require("mongoose");

const userCommentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
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
