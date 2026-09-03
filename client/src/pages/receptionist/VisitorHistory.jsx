import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const VisitorHistory = () => {
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

  const fetchHistory = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (customFilters.visitorName) {
        params.visitorName = customFilters.visitorName;
      }

      if (customFilters.employeeName) {
        params.employeeName = customFilters.employeeName;
      }

      if (customFilters.visitDate) {
        params.visitDate = customFilters.visitDate;
      }

      if (customFilters.status) {
        params.status = customFilters.status;
      }

      const response = await api.get("/visitors", {
        params,
      });

      const data = response.data?.visitors || [];

      const historyData = data.filter((visitor) =>
        ["checked_out", "rejected", "cancelled"].includes(visitor.status),
      );

      setVisitors(historyData);
    } catch (err) {
      console.error("History fetch error:", err);

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
    const emptyFilters = {
      visitorName: "",
      employeeName: "",
      visitDate: "",
      status: "",
    };

    setFilters(emptyFilters);
    fetchHistory(emptyFilters);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    return `history-status history-status-${status}`;
  };

  return (
    <div className="receptionist-page">
      {/* PAGE HEADER */}
      <div className="receptionist-page-header">
        <div>
          <h1>Visitor History</h1>

          <p>View previous visitor visits and their activity.</p>
        </div>

        <button className="secondary-btn" onClick={() => fetchHistory()}>
          Refresh
        </button>
      </div>

      {/* SEARCH CARD */}
      <div className="history-search-card">
        <div className="history-section-heading">
          <h2>Search History</h2>

          <p>Search by visitor, employee, date or status.</p>
        </div>

        <form className="history-filter-grid" onSubmit={handleSearch}>
          <div className="history-field">
            <label>Visitor Name</label>

            <input
              type="text"
              name="visitorName"
              placeholder="Visitor name"
              value={filters.visitorName}
              onChange={handleChange}
            />
          </div>

          <div className="history-field">
            <label>Employee Name</label>

            <input
              type="text"
              name="employeeName"
              placeholder="Employee name"
              value={filters.employeeName}
              onChange={handleChange}
            />
          </div>

          <div className="history-field">
            <label>Visit Date</label>

            <input
              type="date"
              name="visitDate"
              value={filters.visitDate}
              onChange={handleChange}
            />
          </div>

          <div className="history-field">
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

          <div className="history-filter-actions">
            <button type="submit" className="primary-btn">
              Search
            </button>

            <button
              type="button"
              className="clear-filter-btn"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* HISTORY TABLE */}
      <div className="history-table-card">
        <div className="history-table-header">
          <div>
            <h2>Visit History</h2>

            <p>{loading ? "Loading..." : `${visitors.length} records found`}</p>
          </div>
        </div>

        {error && <div className="history-error">{error}</div>}

        {loading ? (
          <div className="history-empty">Loading visitor history...</div>
        ) : visitors.length === 0 ? (
          <div className="history-empty">No visitor history found.</div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
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
                      <div className="history-visitor-name">
                        {visitor.visitorName}
                      </div>

                      {visitor.company && (
                        <div className="history-company">{visitor.company}</div>
                      )}
                    </td>

                    <td>{visitor.phone}</td>

                    <td>{visitor.employee?.name || "-"}</td>

                    <td>{formatDate(visitor.visitDate)}</td>

                    <td>{formatTime(visitor.checkInTime)}</td>

                    <td>{formatTime(visitor.checkOutTime)}</td>

                    <td>
                      <span className={getStatusClass(visitor.status)}>
                        {visitor.status === "checked_out"
                          ? "Checked Out"
                          : visitor.status === "rejected"
                            ? "Rejected"
                            : "Cancelled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BACK BUTTON */}
      <div className="history-bottom-actions">
        <button
          className="secondary-btn"
          onClick={() => navigate("/receptionist/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default VisitorHistory;
