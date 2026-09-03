import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/employee/EmployeeDashboard.css";

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/visitors/my-requests");

      setRequests(response.data.visitors || []);
    } catch (error) {
      console.error("Failed to load visitor requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pending = requests.filter((item) => item.status === "pending").length;

  const approved = requests.filter((item) => item.status === "approved").length;

  const rejected = requests.filter((item) => item.status === "rejected").length;

  return (
    <div className="employee-dashboard">
      {/* HEADER */}
      <div className="employee-dashboard-header">
        <div className="employee-dashboard-title">
          <h1>Employee Dashboard</h1>
          <p>Review and manage visitor requests assigned to you.</p>
        </div>

        <button
          type="button"
          className="employee-refresh-btn"
          onClick={fetchRequests}
        >
          Refresh
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="employee-stats">
        <div className="employee-stat-card">
          <span className="employee-stat-label">Pending Requests</span>

          <strong className="employee-stat-value">{pending}</strong>
        </div>

        <div className="employee-stat-card">
          <span className="employee-stat-label">Approved</span>

          <strong className="employee-stat-value">{approved}</strong>
        </div>

        <div className="employee-stat-card">
          <span className="employee-stat-label">Rejected</span>

          <strong className="employee-stat-value">{rejected}</strong>
        </div>

        <div className="employee-stat-card">
          <span className="employee-stat-label">Total Requests</span>

          <strong className="employee-stat-value">{requests.length}</strong>
        </div>
      </div>

      {/* VISITOR REQUESTS */}
      <section className="employee-requests-card">
        <div className="employee-requests-header">
          <h2>Visitor Requests</h2>

          <p>Review visitor requests and approve or reject them.</p>
        </div>

        {loading ? (
          <div className="employee-empty-state">
            <div className="employee-empty-icon">…</div>

            <h3>Loading requests...</h3>

            <p>Please wait while your visitor requests are loaded.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="employee-empty-state">
            <div className="employee-empty-icon">♟</div>

            <h3>No visitor requests</h3>

            <p>You currently have no visitor requests assigned to you.</p>
          </div>
        ) : (
          <div className="employee-empty-state">
            <h3>{requests.length} visitor request(s)</h3>

            <p>Open Visitor Requests from the sidebar to review them.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
