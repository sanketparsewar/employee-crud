const express = require("express");
const {
  register,
  login,
  logout,
  refreshAccessToken,
} = require("../controllers/auth.controller");
const { validateEmployee } = require("../middlewares/validate.middleware");
const router = express.Router();

// auth routes
router.post("/register", validateEmployee, register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
