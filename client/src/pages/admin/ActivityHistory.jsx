import { useEffect, useState } from "react";
import api from "../../services/api";

const ActivityHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: "",
  });

  const fetchLogs = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (customFilters.action) {
        params.action = customFilters.action;
      }

      if (customFilters.startDate) {
        params.startDate = customFilters.startDate;
      }

      if (customFilters.endDate) {
        params.endDate = customFilters.endDate;
      }

      const response = await api.get("/activity", { params });

      setLogs(response.data.logs || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load activity history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(filters);
  };

  const handleClear = () => {
    const emptyFilters = {
      action: "",
      startDate: "",
      endDate: "",
    };

    setFilters(emptyFilters);
    fetchLogs(emptyFilters);
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionClass = (action) => {
    switch (action) {
      case "Created":
        return "activity-created";
      case "Approved":
        return "activity-approved";
      case "Rejected":
        return "activity-rejected";
      case "Checked In":
        return "activity-checkin";
      case "Checked Out":
        return "activity-checkout";
      case "Cancelled":
        return "activity-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Activity History</h1>
          <p>Track all visitor-related activities.</p>
        </div>

        <button className="secondary-btn" onClick={() => fetchLogs()}>
          Refresh
        </button>
      </div>

      <div className="content-card activity-filter-card">
        <div className="section-heading">
          <h2>Search Activity</h2>
          <p>Filter activity by action or date range.</p>
        </div>

        <form className="activity-filter-grid" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Action</label>

            <select
              name="action"
              value={filters.action}
              onChange={handleChange}
            >
              <option value="">All Actions</option>
              <option value="Created">Created</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>From Date</label>

            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>To Date</label>

            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="activity-filter-actions">
            <button type="submit" className="search-btn">
              Search
            </button>

            <button type="button" className="clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="content-card">
        <div className="section-heading">
          <h2>Activity Logs</h2>
          <p>{logs.length} activities found</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading activity history...</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">No activity records found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table activity-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Visitor</th>
                  <th>Employee</th>
                  <th>Performed By</th>
                  <th>Date & Time</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span
                        className={`activity-badge ${getActionClass(
                          log.action,
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>
                      <strong>{log.visitor?.visitorName || "-"}</strong>

                      <small>{log.visitor?.phone || ""}</small>
                    </td>

                    <td>{log.visitor?.employee?.name || "-"}</td>

                    <td>
                      <strong>{log.performedBy?.name || "-"}</strong>

                      <small>{log.performedBy?.role || ""}</small>
                    </td>

                    <td>{formatDateTime(log.createdAt)}</td>

                    <td>{log.details || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
