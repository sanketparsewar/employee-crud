const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateToken = async (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "5m",
  });

  return token;
};
