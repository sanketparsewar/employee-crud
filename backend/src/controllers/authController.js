const User = require("../models/user");
const { hashPassword,comparePassword } = require("../services/authService");
const {generateToken} = require("../services/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required." });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    console.log(newUser);

    await newUser.save();
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const user = await User.findOne({ email});
    if (!user) {
      return res.send(404).json({ message: "User not Found." });
    }
    console.log(user)

    const isMatch = await comparePassword(password,user.password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await generateToken(user);
    
    res.json({ message: "Logged in successfully", token: token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

module.exports = { register, login };
