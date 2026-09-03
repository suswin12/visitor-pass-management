import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const History = () => {
  const navigate = useNavigate();

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    visitorName: "",
    employeeName: "",
    visitDate: "",
    status: "",
  });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        history: "true",
      };

      if (filters.visitorName.trim()) {
        params.visitorName = filters.visitorName.trim();
      }

      if (filters.employeeName.trim()) {
        params.employeeName = filters.employeeName.trim();
      }

      if (filters.visitDate) {
        params.visitDate = filters.visitDate;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      const response = await api.get("/visitors", { params });

      setVisitors(response.data.visitors || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load visitor history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleClear = () => {
    setFilters({
      visitorName: "",
      employeeName: "",
      visitDate: "",
      status: "",
    });

    setTimeout(() => {
      fetchHistory();
    }, 0);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    if (status === "checked_in") return "Checked In";
    if (status === "checked_out") return "Checked Out";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="receptionist-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Visitor History</h1>
          <p>View previous visitor visits and their activity.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={fetchHistory}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="visitor-card">
        <div className="visitor-card-header">
          <div>
            <h2>Search History</h2>
            <p>Search by visitor, employee, date or status.</p>
          </div>
        </div>

        <form className="visitor-filter-form" onSubmit={handleSearch}>
          <div className="visitor-filter-field">
            <label>Visitor Name</label>

            <input
              type="text"
              name="visitorName"
              value={filters.visitorName}
              onChange={handleChange}
              placeholder="Visitor name"
            />
          </div>

          <div className="visitor-filter-field">
            <label>Employee Name</label>

            <input
              type="text"
              name="employeeName"
              value={filters.employeeName}
              onChange={handleChange}
              placeholder="Employee name"
            />
          </div>

          <div className="visitor-filter-field">
            <label>Visit Date</label>

            <input
              type="date"
              name="visitDate"
              value={filters.visitDate}
              onChange={handleChange}
            />
          </div>

          <div className="visitor-filter-field">
            <label>Status</label>

            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">All Status</option>
              <option value="checked_out">Checked Out</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit" className="search-btn">
            Search
          </button>

          <button type="button" className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </form>
      </div>

      {/* HISTORY TABLE */}
      <div className="visitor-card">
        <div className="visitor-list-header">
          <div>
            <h2>Visit History</h2>

            <p>
              {loading
                ? "Loading history..."
                : `${visitors.length} record${
                    visitors.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && visitors.length === 0 && (
          <div className="empty-state">
            <h3>No history found</h3>
            <p>No visitor history matches your search.</p>
          </div>
        )}

        {!loading && visitors.length > 0 && (
          <div className="visitor-table-container">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Phone</th>
                  <th>Employee</th>
                  <th>Visit Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {visitors.map((visitor) => (
                  <tr key={visitor._id}>
                    <td>
                      <div className="visitor-name-cell">
                        <strong>{visitor.visitorName}</strong>

                        {visitor.company && <span>{visitor.company}</span>}
                      </div>
                    </td>

                    <td>{visitor.phone || "-"}</td>

                    <td>{visitor.employee?.name || "-"}</td>

                    <td>{formatDate(visitor.visitDate)}</td>

                    <td>{formatTime(visitor.checkInTime)}</td>

                    <td>{formatTime(visitor.checkOutTime)}</td>

                    <td>
                      <span className={`visitor-status ${visitor.status}`}>
                        {formatStatus(visitor.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button
        className="back-dashboard-btn"
        onClick={() => navigate("/receptionist/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default History;
