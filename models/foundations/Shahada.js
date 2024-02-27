const mongoose = require("mongoose");

const shahadaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  detailInfo: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      banner: String,
      title: {
        type: String,
        required: true,
        qnique: true,
      },
      parts: [
        {
          detailsText: String,
          ref: {
            quran: {
              ayahNum: Number,
              surahNum: Number,
              surahName: String,
            },
            hadith: {
              hadithNum: Number,
              hadithBook: String,
            },
          },
        },
      ],
    },
  ],
  category: {
    type: String,
    enum: ["shahada"],
    required: true,
  },
});

const Shahada = mongoose.model("Shahada", shahadaSchema);

module.exports = Shahada;
