import { NavLink, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ReceptionistLayout = ({ children }) => {
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
    <div className="receptionist-layout">
      <aside className="receptionist-sidebar">
        <div className="receptionist-brand">
          <div className="brand-icon">VP</div>

          <div>
            <h2>Visitor Pass</h2>
            <span>Reception</span>
          </div>
        </div>

        <nav className="receptionist-nav">
          <p className="nav-section-title">MAIN</p>

          <NavLink
            to="/receptionist/dashboard"
            className={({ isActive }) =>
              `receptionist-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/receptionist/register"
            className={({ isActive }) =>
              `receptionist-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">＋</span>
            <span>Register Visitor</span>
          </NavLink>

          <NavLink
            to="/receptionist/visitors"
            className={({ isActive }) =>
              `receptionist-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">♟</span>
            <span>Visitor Management</span>
          </NavLink>

          <NavLink
            to="/receptionist/history"
            className={({ isActive }) =>
              `receptionist-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">◷</span>
            <span>Visitor History</span>
          </NavLink>
        </nav>

        <div className="receptionist-sidebar-bottom">
          <div className="receptionist-user">
            <div className="receptionist-avatar">R</div>

            <div className="receptionist-user-info">
              <strong>Receptionist</strong>
              <span>Front Desk</span>
            </div>
          </div>

          <button className="receptionist-logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="receptionist-main">
        <header className="receptionist-topbar">
          <div>
            <h3>Reception Desk</h3>
            <p>Visitor Pass Management System</p>
          </div>

          <div className="topbar-status">
            <span className="status-dot"></span>
            <span>Online</span>
          </div>
        </header>

        <div className="receptionist-content">{children}</div>
      </main>
    </div>
  );
};

export default ReceptionistLayout;
