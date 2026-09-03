import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    pendingRequests: 0,
    todayVisitors: 0,
    currentlyInside: 0,
    scheduledVisitors: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/visitors/receptionist/dashboard");

      setDashboard(response.data.dashboard);
    } catch (err) {
      console.error("Receptionist dashboard error:", err);

      setError(err.response?.data?.message || "Unable to load dashboard");
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
      value: dashboard.pendingRequests,
      icon: "⏳",
      className: "pending",
    },
    {
      title: "Today's Visitors",
      value: dashboard.todayVisitors,
      icon: "👥",
      className: "today",
    },
    {
      title: "Currently Inside",
      value: dashboard.currentlyInside,
      icon: "🏢",
      className: "inside",
    },
    {
      title: "Scheduled Visitors",
      value: dashboard.scheduledVisitors,
      icon: "📅",
      className: "scheduled",
    },
  ];

  return (
    <div className="page-container receptionist-dashboard">
      <div className="page-header">
        <div>
          <h1>Receptionist Dashboard</h1>
          <p>Manage visitor registrations, check-ins and check-outs.</p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchDashboard}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-cards">
        {cards.map((card) => (
          <div className={`dashboard-card ${card.className}`} key={card.title}>
            <div className="dashboard-card-icon">{card.icon}</div>

            <div className="dashboard-card-content">
              <p>{card.title}</p>

              <h2>{loading ? "..." : card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions-section">
        <div className="section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Frequently used receptionist operations</p>
          </div>
        </div>

        <div className="quick-actions">
          <button
            className="quick-action-card"
            onClick={() => navigate("/receptionist/register")}
          >
            <span className="quick-action-icon">➕</span>

            <div>
              <h3>Register Visitor</h3>
              <p>Create a new visitor request</p>
            </div>
          </button>

          <button
            className="quick-action-card"
            onClick={() => navigate("/receptionist/visitors")}
          >
            <span className="quick-action-icon">👥</span>

            <div>
              <h3>Visitor Management</h3>
              <p>View and manage visitors</p>
            </div>
          </button>

          <button
            className="quick-action-card"
            onClick={() => navigate("/receptionist/visitors")}
          >
            <span className="quick-action-icon">🟢</span>

            <div>
              <h3>Check In / Check Out</h3>
              <p>Manage visitor entry and exit</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
