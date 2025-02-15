const express = require("express");
const connectDB = require("./config/configdb");
require("dotenv").config();
const authRouter = require("./routes/authRouter");

const app = express();
const PORT = process.env.PORT;

connectDB.connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);

module.exports = { app, PORT };
