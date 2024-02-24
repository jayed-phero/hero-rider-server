const mongoose = require("mongoose");

// Define sub-schema for Quranic reference
const QuranReferenceSchema = new mongoose.Schema({
  ayahNum: Number,
  surahNum: Number,
  surahName: String,
});

// Define sub-schema for Hadith reference
const HadithReferenceSchema = new mongoose.Schema({
  hadithNum: Number,
  hadithBook: String,
});

// Define sub-schema for parts
const PartSchema = new mongoose.Schema({
  detailsText: String,
  ref: {
    quran: QuranReferenceSchema,
    hadith: HadithReferenceSchema,
  },
});

// Define schema for detailed information
const DetailInfoSchema = new mongoose.Schema({
  banner: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  parts: [PartSchema],
});

// Define schema for data items
const DataItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: String,
  detailInfo: [DetailInfoSchema],
});

// Define schema for the main collection
const SolatCollectionSchema = new mongoose.Schema({
  collection: {
    type: String,
    required: true,
    default: "solat",
  },
  data: [DataItemSchema],
});

// Compile the schema into a model
const SolatCollection = mongoose.model(
  "SolatCollection",
  SolatCollectionSchema
);

module.exports = SolatCollection;
