const mongoose = require("mongoose");

const zakatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: String,
  detailInfo: [
    {
      banner: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
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
});

const Zakat = mongoose.model("Zakat", zakatSchema);

module.exports = Zakat;
