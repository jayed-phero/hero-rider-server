const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("A user connected");

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(cors());
app.use(express.json());

const verificationCodes = {};

// Nodemailer configuration (replace with your email service details)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.msatzvk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// / Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

async function run() {
  try {
    const lecturerCollection = client
      .db("QuranicLife")
      .collection("islamicPodcast");
    const poscastCollection = client.db("QuranicLife").collection("lectures");
    const masyalaCollection = client.db("QuranicLife").collection("masyalas");
    const usersCollection = client.db("QuranicLife").collection("users");
    const qlitePostCollection = client
      .db("QuranicLife")
      .collection("qlitePosts");

    // // WebSocket connection
    // io.on('connection', (socket) => {
    //     console.log('A user connected');

    //     // Disconnect event
    //     socket.on('disconnect', () => {
    //         console.log('User disconnected');
    //     });
    // });

    // changeStream.on('change', (change) => {
    //     console.log('Change:', change);

    //     if (change.operationType == 'insert') {
    //         console.log('insert')
    //     }
    //     // Send notification to connected clients (Flutter apps)
    //     io.emit('newData', { message: 'New data available!', link: 'your-link-to-new-data' });
    // });

    app.post("/qlitePosts", authenticate, async (req, res) => {
      const postData = req.body;
      postData.userID = req.user.id;

      try {
        const result = await qlitePostCollection.insertOne(postData);
        res.json({
          result: result,
          status: "success",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Like a post
    app.post("/qlitePosts/:postId/like", authenticate, async (req, res) => {
      const postId = req.params.postId;
      const userId = req.user.id;

      try {
        const result = await qlitePostCollection.updateOne(
          { _id: ObjectId(postId) },
          { $addToSet: { likes: userId } }
        );

        res.json({
          result: result,
          status: "success",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Comment on a post
    app.post("/qlitePosts/:postId/comment", authenticate, async (req, res) => {
      const postId = req.params.postId;
      const userId = req.user.id;
      const commentData = req.body;

      try {
        const result = await qlitePostCollection.updateOne(
          { _id: ObjectId(postId) },
          { $push: { comments: { userId: userId, text: commentData.text } } }
        );

        res.json({
          result: result,
          status: "success",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.put("/qlitePosts/:postId", authenticate, async (req, res) => {
      const postId = req.params.postId;
      const userId = req.user.id;
      const updatedData = req.body;

      try {
        const result = await qlitePostCollection.updateOne(
          { _id: ObjectId(postId), userID: userId },
          { $set: updatedData }
        );

        res.json({
          result: result,
          status: "success",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.delete("/qlitePosts/:postId", authenticate, async (req, res) => {
      const postId = req.params.postId;
      const userId = req.user.id;

      try {
        const result = await qlitePostCollection.deleteOne({
          _id: ObjectId(postId),
          userID: userId,
        });

        res.json({
          result: result,
          status: "success",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Add Reaction
    app.post(
      "/qlitePosts/:postId/reactions",
      authenticate,
      async (req, res) => {
        const postId = req.params.postId;
        const userId = req.user.id;
        const reactionType = req.body.reactionType;

        try {
          const result = await qlitePostCollection.updateOne(
            { _id: ObjectId(postId) },
            { $addToSet: { reactions: { userId: userId, type: reactionType } } }
          );

          res.json({
            result: result,
            status: "success",
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    );

    // Remove Reaction
    app.delete(
      "/qlitePosts/:postId/reactions",
      authenticate,
      async (req, res) => {
        const postId = req.params.postId;
        const userId = req.user.id;
        const reactionType = req.body.reactionType;

        try {
          const result = await qlitePostCollection.updateOne(
            { _id: ObjectId(postId) },
            { $pull: { reactions: { userId: userId, type: reactionType } } }
          );

          res.json({
            result: result,
            status: "success",
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    );

    // Edit Comment
    app.put(
      "/qlitePosts/:postId/comments/:commentId",
      authenticate,
      async (req, res) => {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const updatedText = req.body.text;

        try {
          const result = await qlitePostCollection.updateOne(
            {
              _id: ObjectId(postId),
              "comments._id": ObjectId(commentId),
              "comments.userId": userId,
            },
            { $set: { "comments.$.text": updatedText } }
          );

          res.json({
            result: result,
            status: "success",
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    );

    // Delete Comment
    app.delete(
      "/qlitePosts/:postId/comments/:commentId",
      authenticate,
      async (req, res) => {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = req.user.id;

        try {
          const result = await qlitePostCollection.updateOne(
            { _id: ObjectId(postId) },
            {
              $pull: { comments: { _id: ObjectId(commentId), userId: userId } },
            }
          );

          res.json({
            result: result,
            status: "success",
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    );

    app.post("/lectures", async (req, res) => {
      const lectureInfo = req.body;

      const existingLecture = await poscastCollection.findOne({
        videoId: lectureInfo.videoId,
      });

      if (existingLecture) {
        return res
          .status(400)
          .json({ error: "Lecture with the same title already exists" });
      } else {
        const result = await poscastCollection.insertOne(lectureInfo);
        return res.json({
          result: result,
          status: "success",
        });
      }
    });

    app.get("/lecturers", async (req, res) => {
      try {
        const lecturers = await lecturerCollection.find().toArray();
        const lecturersWithCounts = [];
        for (const lecturer of lecturers) {
          const lecturerId = lecturer.lecturerId;
          const lectureCount = await poscastCollection.countDocuments({
            lecturerId,
          });

          lecturersWithCounts.push({
            lecturerId: lecturer.lecturerId,
            name: lecturer.name,
            image: lecturer.image,
            lectureCount: lectureCount,
          });
        }
        res.json(lecturersWithCounts);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/lectures/:lecturerId", async (req, res) => {
      const lecturerId = req.params.lecturerId;

      try {
        const lectures = await poscastCollection
          .find({ lecturerId })
          .sort({ $natural: -1 })
          .toArray();
        res.json(lectures);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/masyalas", async (req, res) => {
      const masyalaInfo = req.body;

      const existingMasyala = await masyalaCollection.findOne({
        videoId: masyalaInfo.videoId,
      });

      if (existingMasyala) {
        return res
          .status(400)
          .json({ error: "Lecture with the same title already exists" });
      } else {
        const result = await masyalaCollection.insertOne(masyalaInfo);
        // Notify connected clients (Flutter apps) about the new data
        io.emit("newData", {
          message: "New masyala available!",
          link: "your-link-to-new-masyala",
        });
        console.log(masyalaInfo);

        return res.json({
          result,
          status: "success",
        });
      }
    });

    app.get("/masyalas", async (req, res) => {
      try {
        const masyalas = await masyalaCollection
          .find()
          .sort({ $natural: -1 })
          .toArray();
        res.json({
          masyalas,
          status: "success",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/masyalas/:lecturerId", async (req, res) => {
      const lecturerId = req.params.lecturerId;

      try {
        const lectures = await masyalaCollection
          .find({ lecturerId })
          .sort({ $natural: -1 })
          .toArray();
        res.json(lectures);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Quranic Life Site is Running");
});

// app.listen(port, () => {
//     console.log(`Quranic Life server is Running on port ${port}`)
// })

server.listen(port, () => {
  console.log(`Quranic Life server is running on port ${port}`);
});

// echo "# hero-rider-server" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/jayed-phero/hero-rider-server.git
// git push -u origin main
