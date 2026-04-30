const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.userId    = verified.id;
    req.userEmail = verified.email;
    req.userRole  = verified.role; // ✅ role added

    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};

module.exports = auth;