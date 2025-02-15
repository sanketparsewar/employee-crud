const express = require("express");
const { register, login } = require("../controllers/authController");
// const verifyToken=require('../middlewares/authentication')
const router = express.Router();

router.get("/", function (req, res) {
  res.send("Hello, World!");
});
router.post("/register", register);
router.post("/login", login);

module.exports = router;
