import { NavLink, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/employee/EmployeeLayout.css";

const EmployeeLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="employee-shell">
      <aside className="employee-sidebar">
        <div className="employee-brand">
          <div className="employee-brand-logo">VP</div>

          <div className="employee-brand-text">
            <h2>Visitor Pass</h2>
            <span>Employee Portal</span>
          </div>
        </div>

        <div className="employee-nav-title">MAIN MENU</div>

        <nav className="employee-nav">
          <NavLink
            to="/employee/dashboard"
            className={({ isActive }) =>
              `employee-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="employee-nav-icon">▦</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/employee/requests"
            className={({ isActive }) =>
              `employee-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="employee-nav-icon">♟</span>
            <span>Visitor Requests</span>
          </NavLink>
        </nav>

        <div className="employee-sidebar-footer">
          <div className="employee-profile">
            <div className="employee-avatar">E</div>

            <div className="employee-profile-info">
              <strong>Employee</strong>
              <span>Employee Desk</span>
            </div>
          </div>

          <button
            type="button"
            className="employee-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="employee-main">{children}</main>
    </div>
  );
};

export default EmployeeLayout;
