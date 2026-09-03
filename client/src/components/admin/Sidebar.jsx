import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      label: "Employees",
      path: "/admin/employees",
      icon: "👥",
    },
    {
      label: "User Accounts",
      path: "/admin/users",
      icon: "👤",
    },
    {
      label: "Visitors",
      path: "/admin/visitors",
      icon: "🧑",
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: "📈",
    },
    {
      label: "Activity History",
      path: "/admin/activity",
      icon: "📝",
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">VP</div>

        <div>
          <h2>Visitor Pass</h2>
          <span>Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-title">MAIN MENU</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
