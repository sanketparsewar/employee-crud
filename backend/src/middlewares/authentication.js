const jwt = require("jsonwebtoken");
require("dotenv").config;

exports.verifyToken = function (req, res) {
  // Verify JWT token here
  // If valid, next()
  // If not valid, send 401 Unauthorized
  const token = req.header["authorization"].split(" ")[1];
  jwt.verify(token, process.env.SERCRET_KEY, (err, decode) => {
    if (err) {
      return res.status(401).json({ message: err.message });
    }
    req.user = decode;
    next();
  });
};

