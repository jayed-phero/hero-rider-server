const mongoose = require("mongoose");

const qlitePostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },

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

    shareCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const QlitePost = mongoose.model("QlitePost", qlitePostSchema);

module.exports = QlitePost;
