const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  //   console.log("token", token);

  try {
    const { email, _id, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { email, _id, role };
    next();
  } catch (error) {
    console.error("error", error);

    // Check for specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    }

    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  authMiddleware,
};
