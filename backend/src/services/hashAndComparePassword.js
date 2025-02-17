const bcrypt = require("bcryptjs");

// Hash password
exports.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

// Compare password
exports.comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

// Encrypt employee data before saving
