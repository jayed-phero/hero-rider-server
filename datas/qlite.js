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
app.post("/qlitePosts/:postId/reactions", authenticate, async (req, res) => {
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
});

// Remove Reaction
app.delete("/qlitePosts/:postId/reactions", authenticate, async (req, res) => {
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
});

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
