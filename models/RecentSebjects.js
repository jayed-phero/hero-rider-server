const mongoose = require("mongoose");

const recentSubjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subjectInfo: {
      type: String,
      required: true,
    },
    arabicCoutes: {
      type: Object,
      text: {
        type: String,
        required: true,
      },
      meaning: {
        type: String,
        required: true,
      },
    },
    link: { type: String },
    subjectDetails: {
      type: String,
    },
    referance: {
      type: String,
    },
    cover: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const RecentSubject = mongoose.model("RecentSubject", recentSubjectSchema);

module.exports = RecentSubject;
