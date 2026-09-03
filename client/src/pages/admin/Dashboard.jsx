import { useEffect, useState } from "react";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    todaysVisitors: 0,
    currentlyInside: 0,
    totalEmployees: 0,
    scheduledVisitors: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/admin");

      setStats(response.data.statistics);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: "⏳",
      className: "card-pending",
    },
    {
      title: "Today's Visitors",
      value: stats.todaysVisitors,
      icon: "👥",
      className: "card-today",
    },
    {
      title: "Currently Inside",
      value: stats.currentlyInside,
      icon: "🚪",
      className: "card-inside",
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: "🧑‍💼",
      className: "card-employees",
    },
    {
      title: "Scheduled Visitors",
      value: stats.scheduledVisitors,
      icon: "📅",
      className: "card-scheduled",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Administrator Dashboard</h1>

          <p>Overview of your visitor management system</p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchDashboard}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-cards">
        {cards.map((card) => (
          <div className={`stat-card ${card.className}`} key={card.title}>
            <div className="stat-card-top">
              <div className="stat-icon">{card.icon}</div>
            </div>

            <div className="stat-value">{loading ? "..." : card.value}</div>

            <div className="stat-title">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-welcome">
        <h2>Welcome to Visitor Pass Management</h2>

        <p>
          Use the navigation menu to manage employees, user accounts, visitor
          requests, reports, and activity history.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
