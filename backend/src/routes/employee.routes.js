const express = require("express");
const {getLoggedEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const router = express.Router();

// User routes
router.get("/logged", verifyJwt, getLoggedEmployee);
router.get("/allemployees", verifyJwt, getAllEmployees);
router.get("/:id", verifyJwt, getEmployeeById);
router.put("/", verifyJwt, updateEmployee);
router.delete("/:id", verifyJwt, deleteEmployee);

module.exports = router;
