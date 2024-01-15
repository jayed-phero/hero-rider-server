// // middleware/jwtverify.js
// const jwt = require('jsonwebtoken');

// const authenticate = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized - Missing token' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'your-secret-key');
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: 'Unauthorized - Invalid token' });
//   }
// };

// module.exports = {
//   authenticate,
// };
// middleware/jwtverify.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Unauthorized" });
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
      return res.status(403).json({ error: "Unauthorized - Invalid token" });
    }

    // Handle other errors
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  authMiddleware,
};
