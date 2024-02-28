const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/user.routes");

const lecturersRoutes = require("./routes/lecturers.routes");
const qlitePost = require("./routes/qlite.routes");
const islamicLecture = require("./routes/islamiclecture.routes");
const recentSubject = require("./routes/recentsubject.routes");
const courses = require("./routes/course.routes");
const shahada = require("./routes/foundation/shahadah.routes");
const qliteStory = require("./routes/qlitestory.routes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to As Sunnah Programe Server!!!");
});

// Use the route files

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lecturers", lecturersRoutes);
app.use("/api/v1/qlite", qlitePost);
app.use("/api/v1/lecture", islamicLecture);
app.use("/api/v1/recent", recentSubject);
app.use("/api/v1/course", courses);
app.use("/api/v1/qlitestory", qliteStory);

// foundation
app.use("/api/v1/foundation/shahada", shahada);

module.exports = app;
