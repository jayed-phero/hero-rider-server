const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Check user role
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Unauthorized - Invalid token" });
  }
};

module.exports = authenticateToken;
