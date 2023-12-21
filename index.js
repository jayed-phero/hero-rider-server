const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const app = require("./app");
dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}`;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB".red.bold);

    // mongoose.connection.db.collection("islamicPodcast").aggregate([
    //   { $match: {} },  // Match all documents
    //   { $out: "lecturers" }  // Output to the Lectureres collection
    // ]).toArray((err, result) => {
    //   if (err) {
    //     console.error("Error copying data:", err);
    //   } else {
    //     console.log("Data copied successfully:", result);
    //   }

    //   mongoose.connection.close();  // Close the connection after copying
    // });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
