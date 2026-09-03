import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    user: null,
    newRole: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.role?.toLowerCase().includes(value),
    );
  }, [users, search]);

  // =========================
  // ADD USER FORM
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/users", formData);

      setSuccess("User account created successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "employee",
      });

      setShowAddModal(false);

      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // OPEN STATUS CONFIRMATION
  // =========================

  const openStatusConfirmation = (user) => {
    setConfirmModal({
      open: true,
      type: "status",
      user,
      newRole: "",
    });
  };

  // =========================
  // OPEN ROLE CONFIRMATION
  // =========================

  const openRoleConfirmation = (user, newRole) => {
    if (user.role === newRole) {
      return;
    }

    setConfirmModal({
      open: true,
      type: "role",
      user,
      newRole,
    });
  };

  // =========================
  // CONFIRM ACTION
  // =========================

  const handleConfirm = async () => {
    const { type, user, newRole } = confirmModal;

    if (!user) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Change Active / Inactive
      if (type === "status") {
        const response = await api.patch(`/users/${user._id}/status`);

        setSuccess(response.data.message || "User status updated successfully");
      }

      // Change Role
      if (type === "role") {
        const response = await api.patch(`/users/${user._id}/role`, {
          role: newRole,
        });

        setSuccess(response.data.message || "User role updated successfully");
      }

      setConfirmModal({
        open: false,
        type: "",
        user: null,
        newRole: "",
      });

      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");

      setConfirmModal({
        open: false,
        type: "",
        user: null,
        newRole: "",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CLOSE CONFIRMATION
  // =========================

  const closeConfirmModal = () => {
    if (saving) return;

    setConfirmModal({
      open: false,
      type: "",
      user: null,
      newRole: "",
    });
  };

  return (
    <div className="users-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>User Account Management</h1>

          <p>Manage system users, roles and account status</p>
        </div>

        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          + Add User
        </button>
      </div>

      {/* =========================
          SUCCESS
      ========================= */}

      {success && <div className="success-message">{success}</div>}

      {/* =========================
          ERROR
      ========================= */}

      {error && <div className="error-message">{error}</div>}

      {/* =========================
          USERS CARD
      ========================= */}

      <div className="users-card">
        <div className="users-card-header">
          <div>
            <h2>User Accounts</h2>

            <p>
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"}
            </p>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Change Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="user-name">{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          user.isActive
                            ? "status-badge active"
                            : "status-badge inactive"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          openRoleConfirmation(user, e.target.value)
                        }
                        className="role-select"
                      >
                        <option value="administrator">Administrator</option>

                        <option value="receptionist">Receptionist</option>

                        <option value="employee">Employee</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className={
                          user.isActive ? "danger-btn" : "activate-btn"
                        }
                        onClick={() => openStatusConfirmation(user)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          ADD USER MODAL
      ========================= */}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Add User</h2>
                <p>Create a new system user account</p>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="user-form">
              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="administrator">Administrator</option>

                  <option value="receptionist">Receptionist</option>

                  <option value="employee">Employee</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          CONFIRMATION MODAL
      ========================= */}

      {confirmModal.open && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">
              {confirmModal.type === "status" ? "?" : "!"}
            </div>

            <h2>
              {confirmModal.type === "status"
                ? confirmModal.user?.isActive
                  ? "Deactivate User?"
                  : "Activate User?"
                : "Change User Role?"}
            </h2>

            <p>
              {confirmModal.type === "status"
                ? confirmModal.user?.isActive
                  ? `Are you sure you want to deactivate ${confirmModal.user?.name}?`
                  : `Are you sure you want to activate ${confirmModal.user?.name}?`
                : `Are you sure you want to change ${confirmModal.user?.name}'s role to ${confirmModal.newRole}?`}
            </p>

            <div className="confirm-actions">
              <button
                className="secondary-btn"
                onClick={closeConfirmModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className={
                  confirmModal.type === "status" && confirmModal.user?.isActive
                    ? "danger-btn"
                    : "primary-btn"
                }
                onClick={handleConfirm}
                disabled={saving}
              >
                {saving ? "Please wait..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
