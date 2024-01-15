const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/user.routes");
const lecturersRoutes = require("./routes/lecturers.routes");
const qlitePost = require("./routes/qlite.routes");
const islamicLecture = require("./routes/islamiclecture.routes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to As Sunnah Programe Server!!!");
});

// Use the route files
// app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/lectures", lecturesRoutes);
app.use("/masyalas", masyalasRoutes);
app.use("/lecturers", lecturersRoutes);
app.use("/qlite", qlitePost);
app.use("/api/v1/lecture", islamicLecture);

module.exports = app;
