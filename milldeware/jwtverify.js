const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to the request
    // req.user = await User.findById(decoded.user.id).select("-password");
    // req.user = await User.findById(decoded.user.id).select(
    //   "email username _id"
    // );

    req.user = decoded;

    next();
  } catch (error) {
    console.error("erroe ff", error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// module.exports = authMiddleware;