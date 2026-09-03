const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Employee = require("../models/Employee");

// Create employee
const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      phone,
      department,
      designation,
    } = req.body;

    if (
      !employeeId ||
      !name ||
      !email ||
      !password ||
      !department ||
      !designation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID, name, email, password, department and designation are required",
      });
    }

    const existingEmployee = await Employee.findOne({ employeeId });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // User password is hashed by User model pre-save middleware
    const user = await User.create({
      name,
      email,
      password,
      role: "employee",
      isActive: true,
    });

    try {
      const employee = await Employee.create({
        employeeId,
        user: user._id,
        name,
        email,
        phone,
        department,
        designation,
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee,
      });
    } catch (employeeError) {
      // Roll back user if employee creation fails
      await User.findByIdAndDelete(user._id);
      throw employeeError;
    }
  } catch (error) {
    console.error("Create employee error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("user", "name email role isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get employees error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single employee
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "user",
      "name email role isActive",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get employee error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const { name, email, phone, department, designation } = req.body;

    // Check email conflict
    if (email && email !== employee.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: employee.user },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    if (name !== undefined) employee.name = name;
    if (email !== undefined) employee.email = email;
    if (phone !== undefined) employee.phone = phone;
    if (department !== undefined) employee.department = department;
    if (designation !== undefined) employee.designation = designation;

    await employee.save();

    // Keep linked User data synchronized
    const user = await User.findById(employee.user);

    if (user) {
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;

      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Update employee error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Activate / deactivate employee
const toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.isActive = !employee.isActive;
    await employee.save();

    const user = await User.findById(employee.user);

    if (user) {
      user.isActive = employee.isActive;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: `Employee ${
        employee.isActive ? "activated" : "deactivated"
      } successfully`,
      employee,
    });
  } catch (error) {
    console.error("Toggle employee status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  toggleEmployeeStatus,
};
