import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="admin-navbar">
      <div>
        <h3>Administrator Panel</h3>
        <p>Visitor Pass Management System</p>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="user-details">
            <strong>{user?.name || "Administrator"}</strong>

            <span>{user?.email || ""}</span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
