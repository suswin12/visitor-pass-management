import { useEffect, useState } from "react";
import api from "../../services/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    designation: "",
  });

  // =========================
  // FETCH EMPLOYEES
  // =========================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employees");

      setEmployees(response.data.employees || []);
    } catch (err) {
      console.error("Fetch employees error:", err);

      setError(err.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const handleAddEmployee = () => {
    setEditingEmployee(null);

    setFormData({
      employeeId: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      department: "",
      designation: "",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const handleEdit = (employee) => {
    setEditingEmployee(employee);

    setFormData({
      employeeId: employee.employeeId || "",
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingEmployee(null);

    setFormData({
      employeeId: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      department: "",
      designation: "",
    });

    setError("");
  };

  // =========================
  // CREATE / UPDATE EMPLOYEE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (
      !formData.employeeId ||
      !formData.name ||
      !formData.email ||
      !formData.department ||
      !formData.designation
    ) {
      setError(
        "Employee ID, name, email, department and designation are required",
      );
      return;
    }

    // Password required only while creating
    if (!editingEmployee && !formData.password) {
      setError("Password is required when creating an employee");
      return;
    }

    try {
      setSaving(true);

      if (editingEmployee) {
        // =========================
        // UPDATE
        // =========================

        const updateData = {
          employeeId: formData.employeeId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          designation: formData.designation,
        };

        // Only send password if entered
        if (formData.password) {
          updateData.password = formData.password;
        }

        await api.put(`/employees/${editingEmployee._id}`, updateData);

        setSuccess("Employee updated successfully");
      } else {
        // =========================
        // CREATE
        // =========================

        await api.post("/employees", formData);

        setSuccess("Employee created successfully");
      }

      await fetchEmployees();

      setTimeout(() => {
        setShowModal(false);
        setEditingEmployee(null);

        setFormData({
          employeeId: "",
          name: "",
          email: "",
          password: "",
          phone: "",
          department: "",
          designation: "",
        });

        setSuccess("");
      }, 700);
    } catch (err) {
      console.error("Save employee error:", err);

      setError(err.response?.data?.message || "Failed to save employee");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const handleToggleStatus = async (employee) => {
    const action = employee.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${employee.name}?`,
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.patch(`/employees/${employee._id}/status`);

      setSuccess(`Employee ${action}d successfully`);

      await fetchEmployees();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Toggle employee status error:", err);

      setError(
        err.response?.data?.message || "Failed to update employee status",
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    return (
      employee.employeeId?.toLowerCase().includes(searchText) ||
      employee.name?.toLowerCase().includes(searchText) ||
      employee.email?.toLowerCase().includes(searchText) ||
      employee.department?.toLowerCase().includes(searchText) ||
      employee.designation?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="employees-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Employee Management</h1>

          <p>Manage employees and their account status</p>
        </div>

        <button className="primary-button" onClick={handleAddEmployee}>
          + Add Employee
        </button>
      </div>

      {/* =========================
          SUCCESS
      ========================= */}

      {success && <div className="success-message">{success}</div>}

      {/* =========================
          ERROR
      ========================= */}

      {error && !showModal && <div className="error-message">{error}</div>}

      {/* =========================
          EMPLOYEE TABLE
      ========================= */}

      <div className="employees-card">
        <div className="employees-card-header">
          <div>
            <h2>Employees</h2>

            <p>
              {filteredEmployees.length}{" "}
              {filteredEmployees.length === 1 ? "employee" : "employees"}
            </p>
          </div>

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading">Loading employees...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">No employees found.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <strong>{employee.employeeId}</strong>
                    </td>

                    <td>{employee.name}</td>

                    <td>{employee.email}</td>

                    <td>{employee.phone || "-"}</td>

                    <td>{employee.department}</td>

                    <td>{employee.designation}</td>

                    <td>
                      <span
                        className={
                          employee.isActive
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>

                        <button
                          className={
                            employee.isActive
                              ? "deactivate-button"
                              : "activate-button"
                          }
                          onClick={() => handleToggleStatus(employee)}
                        >
                          {employee.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (
        <div className="modal-overlay">
          <div className="employee-modal">
            <div className="modal-header">
              <div>
                <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>

                <p>
                  {editingEmployee
                    ? "Update employee information"
                    : "Create a new employee account"}
                </p>
              </div>

              <button
                className="close-button"
                onClick={handleCloseModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Employee ID */}

                <div className="form-group">
                  <label>Employee ID *</label>

                  <input
                    type="text"
                    name="employeeId"
                    placeholder="EMP002"
                    value={formData.employeeId}
                    onChange={handleChange}
                  />
                </div>

                {/* Name */}

                <div className="form-group">
                  <label>Full Name *</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter employee name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}

                <div className="form-group">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="employee@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}

                <div className="form-group">
                  <label>Password {!editingEmployee && "*"}</label>

                  <input
                    type="password"
                    name="password"
                    placeholder={
                      editingEmployee
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone */}

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Department */}

                <div className="form-group">
                  <label>Department *</label>

                  <input
                    type="text"
                    name="department"
                    placeholder="Engineering"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                {/* Designation */}

                <div className="form-group full-width">
                  <label>Designation *</label>

                  <input
                    type="text"
                    name="designation"
                    placeholder="Software Engineer"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingEmployee
                      ? "Update Employee"
                      : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
