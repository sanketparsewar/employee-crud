const express = require("express");
const {
  getLoggedEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const upload = require("../services/multer");
const router = express.Router();

// User routes
router.get("/logged", verifyJwt, getLoggedEmployee);
router.get("/allemployees", verifyJwt, getAllEmployees);
router.get("/:id", verifyJwt, getEmployeeById);
router.put("/", verifyJwt, updateEmployee);
router.delete("/:id", verifyJwt, deleteEmployee);

// Image upload route
// router.post("/upload", upload.single("file"), (req, res) => {
//   try{
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     res.status(200).json({ message: "Image uploaded successfully" });
//   }
//   catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
