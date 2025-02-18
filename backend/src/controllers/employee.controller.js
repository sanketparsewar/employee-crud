const Employee = require("../models/employee.model");

exports.getLoggedEmployee = async (req, res) => {
  try {
    const employee = req.employee;
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id).select(
      "-password -refreshToken -__v"
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    if(req.employee.role !== "Admin"){
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const employees = await Employee.find({}).select(
      "-password -refreshToken -__v"
    );
    if (employees.length == 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const id = req.employee._id;
    const { name, email, department, role } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name || this.updateEmployee.name,
          email: email || this.updateEmployee.email,
          department: department || this.updateEmployee.department,
          role: role || this.updateEmployee.role,
        },
      },
      { new: true }
    ).select("-password -refreshToken -__v");
    console.log(updatedEmployee);
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await updatedEmployee.save();
    res
      .status(200)
      .json({ updatedEmployee, message: "Employee udpdated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
