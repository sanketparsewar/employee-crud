const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { verifyJwt } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("Hello, World!");
});
router.post("/register", register);
router.post("/login", login);

// secured Routes
router.get("/logout", verifyJwt, logout);

module.exports = router;
