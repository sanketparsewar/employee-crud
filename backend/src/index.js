const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/configdb");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// import routes
const authRouter = require("./routes/auth.routes");
const employeeRouter = require("./routes/employee.routes");
const cloudinaryRouter = require("./routes/cloudinary.routes");

const app = express();
const PORT = process.env.PORT;

connectDB();
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/upload", cloudinaryRouter);

module.exports = { app, PORT };
