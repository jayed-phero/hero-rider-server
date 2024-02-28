const mongoose = require("mongoose");

const qliteStorySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storyImage: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const QliteStory = mongoose.model("QliteStory", qliteStorySchema);

module.exports = QliteStory;
