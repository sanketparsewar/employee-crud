const express = require("express");
const { connectDB } = require("./config/configdb");
require("dotenv").config();
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRouter);

module.exports = { app, PORT };
