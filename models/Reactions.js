const mongoose = require("mongoose");

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
  qlitePostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QlitePost",
    required: true,
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
