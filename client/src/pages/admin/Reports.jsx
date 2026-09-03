import { useEffect, useState } from "react";
import api from "../../services/api";

const Reports = () => {
  const [reportType, setReportType] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async (type = reportType) => {
    try {
      setLoading(true);
      setError("");

      let url = `/reports?type=${type}`;

      if (type === "custom") {
        if (!fromDate || !toDate) {
          setError("Please select both from and to dates.");
          setLoading(false);
          return;
        }

        // url = `/reports?type=custom&fromDate=${fromDate}&toDate=${toDate}`;
        url = `/reports?type=custom&startDate=${fromDate}&endDate=${toDate}`;
      }

      const response = await api.get(url);

      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load visitor report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport("today");
  }, []);

  const handleTypeChange = (type) => {
    setReportType(type);

    if (type !== "custom") {
      fetchReport(type);
    }
  };

  const handleCustomSearch = () => {
    fetchReport("custom");
  };

  const statistics = report?.statistics || {};

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Visitor Reports</h1>
          <p>View visitor statistics and activity reports.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => fetchReport(reportType)}
        >
          Refresh
        </button>
      </div>

      <div className="report-filter-card">
        <h2>Report Period</h2>

        <div className="report-type-buttons">
          <button
            className={
              reportType === "today"
                ? "report-type-btn active"
                : "report-type-btn"
            }
            onClick={() => handleTypeChange("today")}
          >
            Today
          </button>

          <button
            className={
              reportType === "week"
                ? "report-type-btn active"
                : "report-type-btn"
            }
            onClick={() => handleTypeChange("week")}
          >
            This Week
          </button>

          <button
            className={
              reportType === "custom"
                ? "report-type-btn active"
                : "report-type-btn"
            }
            onClick={() => setReportType("custom")}
          >
            Custom Range
          </button>
        </div>

        {reportType === "custom" && (
          <div className="custom-report-filter">
            <div className="form-group">
              <label>From Date</label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>To Date</label>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button className="primary-btn" onClick={handleCustomSearch}>
              Generate Report
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading visitor report...</div>
      ) : report ? (
        <>
          <div className="report-range-card">
            <div>
              <span>Report Period</span>
              <strong>
                {new Date(report.range.start).toLocaleDateString()} -{" "}
                {new Date(report.range.end).toLocaleDateString()}
              </strong>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Visitors</span>
              <strong>{statistics.totalVisitors}</strong>
            </div>

            <div className="stat-card">
              <span>Pending</span>
              <strong>{statistics.pending}</strong>
            </div>

            <div className="stat-card">
              <span>Approved</span>
              <strong>{statistics.approved}</strong>
            </div>

            <div className="stat-card">
              <span>Rejected</span>
              <strong>{statistics.rejected}</strong>
            </div>

            <div className="stat-card">
              <span>Checked In</span>
              <strong>{statistics.checkedIn}</strong>
            </div>

            <div className="stat-card">
              <span>Checked Out</span>
              <strong>{statistics.checkedOut}</strong>
            </div>

            <div className="stat-card">
              <span>Cancelled</span>
              <strong>{statistics.cancelled}</strong>
            </div>

            <div className="stat-card">
              <span>Completed Visits</span>
              <strong>{statistics.completedVisits}</strong>
            </div>
          </div>

          <div className="report-summary-card">
            <div>
              <h2>Approval Rate</h2>
              <p>Percentage of visitor requests approved during this period.</p>
            </div>

            <div className="approval-rate">{statistics.approvalRate}%</div>
          </div>
        </>
      ) : (
        <div className="empty-state">No report data available.</div>
      )}
    </div>
  );
};

export default Reports;
