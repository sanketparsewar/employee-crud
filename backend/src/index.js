const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/configdb");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// import routes
const authRouter = require("./routes/auth.routes");
const employeeRouter = require("./routes/employee.routes");

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/employee", employeeRouter);

module.exports = { app, PORT };
