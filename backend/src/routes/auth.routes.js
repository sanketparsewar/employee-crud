const express = require("express");
const { register, login, logout,refreshAccessToken } = require("../controllers/auth.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyJwt, logout);
router.post('/refresh-token',refreshAccessToken)

module.exports = router;
