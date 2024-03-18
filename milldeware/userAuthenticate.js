const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log(authHeader, "header");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
    }

    // Attach the user data to the request object
    req.user = {
      enrolledCourses: user.enrolledCourses,
      id: user._id,
      email: user.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({ statusCode: 401, message: "Unauthorized" });
  }
};

module.exports = {
  userAuthenticate,
};
