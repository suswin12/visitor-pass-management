import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/visitors/my-requests");

      setRequests(response.data.visitors || []);
    } catch (error) {
      console.error("Failed to fetch visitor requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingCount = requests.filter(
    (visitor) => visitor.status === "pending",
  ).length;

  const approvedCount = requests.filter(
    (visitor) =>
      visitor.status === "approved" ||
      visitor.status === "checked_in" ||
      visitor.status === "checked_out",
  ).length;

  const rejectedCount = requests.filter(
    (visitor) => visitor.status === "rejected",
  ).length;

  const totalCount = requests.length;

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge pending";

      case "approved":
        return "status-badge approved";

      case "checked_in":
        return "status-badge checked-in";

      case "checked_out":
        return "status-badge checked-out";

      case "rejected":
        return "status-badge rejected";

      case "cancelled":
        return "status-badge cancelled";

      default:
        return "status-badge";
    }
  };

  const formatStatus = (status) => {
    return status
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div className="employee-dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Review and manage visitor requests assigned to you.</p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchRequests}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon pending-icon">⌛</div>

          <div>
            <span>Pending Requests</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon approved-icon">✓</div>

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rejected-icon">×</div>

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-icon">▦</div>

          <div>
            <span>Total Requests</span>
            <strong>{totalCount}</strong>
          </div>
        </div>
      </div>

      {/* Visitor Requests */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Visitor Requests</h2>
            <p>Review visitor requests and approve or reject them.</p>
          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/employee/requests")}
          >
            View All Requests
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading requests...</h3>
            <p>Please wait while visitor requests are loaded.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <h3>No visitor requests</h3>
            <p>You currently have no visitor requests assigned to you.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table employee-request-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Phone</th>
                  <th>Visit Date</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.slice(0, 5).map((visitor) => (
                  <tr key={visitor._id}>
                    <td>
                      <div className="visitor-table-name">
                        {visitor.visitorName}
                      </div>

                      {visitor.company && (
                        <div className="visitor-table-company">
                          {visitor.company}
                        </div>
                      )}
                    </td>

                    <td>{visitor.phone}</td>

                    <td>{formatDate(visitor.visitDate)}</td>

                    <td title={visitor.purpose} className="purpose-cell">
                      {visitor.purpose}
                    </td>

                    <td>
                      <span className={getStatusClass(visitor.status)}>
                        {formatStatus(visitor.status)}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-view-btn"
                        onClick={() =>
                          navigate(`/employee/requests/${visitor._id}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="section-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Frequently used employee operations.</p>
          </div>
        </div>

        <div className="quick-actions-grid">
          <button
            className="quick-action-card"
            onClick={() => navigate("/employee/requests")}
          >
            <div className="quick-action-icon">♟</div>

            <div>
              <h3>Visitor Requests</h3>
              <p>Review pending visitor requests</p>
            </div>
          </button>

          <button className="quick-action-card" onClick={fetchRequests}>
            <div className="quick-action-icon">↻</div>

            <div>
              <h3>Refresh Requests</h3>
              <p>Check for new visitor requests</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
