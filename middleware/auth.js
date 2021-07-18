require("dotenv").config();
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("AUTH_TOKEN");

  //Check for token
  if (!token) return res.status(401).json({ message: "Unauthorized User" });

  try {
    //Verify Token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;

    next();
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
  }
}

module.exports = auth;
