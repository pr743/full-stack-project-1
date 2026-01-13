const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
 
  let token = req.header("auth-token") || req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  }

  
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim(); 
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


