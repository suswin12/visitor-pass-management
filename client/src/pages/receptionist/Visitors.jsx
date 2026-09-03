// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// const Visitors = () => {
//   const navigate = useNavigate();

//   const [visitors, setVisitors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [filters, setFilters] = useState({
//     visitorName: "",
//     employeeName: "",
//     date: "",
//     status: "",
//   });

//   const fetchVisitors = async (customFilters = filters) => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = {};

//       if (customFilters.visitorName.trim()) {
//         params.visitorName = customFilters.visitorName.trim();
//       }

//       if (customFilters.employeeName.trim()) {
//         params.employeeName = customFilters.employeeName.trim();
//       }

//       if (customFilters.date) {
//         params.date = customFilters.date;
//       }

//       if (customFilters.status) {
//         params.status = customFilters.status;
//       }

//       const response = await api.get("/visitors", { params });

//       setVisitors(response.data.visitors || []);
//     } catch (err) {
//       console.error("Fetch visitors error:", err);

//       setError(err.response?.data?.message || "Failed to load visitors.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVisitors();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     const updatedFilters = {
//       ...filters,
//       [name]: value,
//     };

//     setFilters(updatedFilters);

//     // Status change immediately filters
//     if (name === "status") {
//       fetchVisitors(updatedFilters);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchVisitors();
//   };

//   const handleClear = () => {
//     const emptyFilters = {
//       visitorName: "",
//       employeeName: "",
//       date: "",
//       status: "",
//     };

//     setFilters(emptyFilters);
//     fetchVisitors(emptyFilters);
//   };

//   const handleRefresh = () => {
//     fetchVisitors();
//   };

//   const formatStatus = (status) => {
//     if (!status) return "-";

//     return status
//       .replaceAll("_", " ")
//       .replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "pending":
//         return "visitor-status pending";

//       case "approved":
//         return "visitor-status approved";

//       case "rejected":
//         return "visitor-status rejected";

//       case "checked_in":
//         return "visitor-status checked-in";

//       case "checked_out":
//         return "visitor-status checked-out";

//       case "cancelled":
//         return "visitor-status cancelled";

//       default:
//         return "visitor-status";
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleDateString("en-GB");
//   };

//   const formatTime = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="receptionist-page">
//       {/* PAGE HEADER */}
//       <div className="visitor-page-header">
//         <div>
//           <h1>Visitor Management</h1>
//           <p>View and manage registered visitors.</p>
//         </div>

//         <button
//           type="button"
//           className="visitor-refresh-btn"
//           onClick={handleRefresh}
//         >
//           ↻ <span>Refresh</span>
//         </button>
//       </div>

//       {/* SEARCH CARD */}
//       <div className="visitor-search-card">
//         <div className="visitor-card-heading">
//           <h2>Search Visitors</h2>
//           <p>Search by visitor, employee, date or status.</p>
//         </div>

//         <form className="visitor-filter-grid" onSubmit={handleSearch}>
//           <input
//             type="text"
//             name="visitorName"
//             placeholder="Visitor name"
//             value={filters.visitorName}
//             onChange={handleChange}
//           />

//           <input
//             type="text"
//             name="employeeName"
//             placeholder="Employee name"
//             value={filters.employeeName}
//             onChange={handleChange}
//           />

//           <input
//             type="date"
//             name="date"
//             value={filters.date}
//             onChange={handleChange}
//           />

//           <select name="status" value={filters.status} onChange={handleChange}>
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//             <option value="checked_in">Checked In</option>
//             <option value="checked_out">Checked Out</option>
//             <option value="cancelled">Cancelled</option>
//           </select>

//           <button type="submit" className="visitor-search-btn">
//             Search
//           </button>

//           <button
//             type="button"
//             className="visitor-clear-btn"
//             onClick={handleClear}
//           >
//             Clear
//           </button>
//         </form>
//       </div>

//       {/* TABLE CARD */}
//       <div className="visitor-table-card">
//         <div className="visitor-table-heading">
//           <div>
//             <h2>Visitors</h2>

//             <p>
//               {visitors.length} visitor
//               {visitors.length !== 1 ? "s" : ""} found
//             </p>
//           </div>
//         </div>

//         {error && <div className="visitor-error">{error}</div>}

//         {loading ? (
//           <div className="visitor-empty">Loading visitors...</div>
//         ) : visitors.length === 0 ? (
//           <div className="visitor-empty">
//             <div className="visitor-empty-icon">👥</div>

//             <h3>No visitors found</h3>

//             <p>No visitor records match your search.</p>
//           </div>
//         ) : (
//           <div className="visitor-table-wrapper">
//             <table className="visitor-data-table">
//               <colgroup>
//                 <col className="col-visitor" />
//                 <col className="col-phone" />
//                 <col className="col-employee" />
//                 <col className="col-date" />
//                 <col className="col-arrival" />
//                 <col className="col-status" />
//                 <col className="col-actions" />
//               </colgroup>

//               <thead>
//                 <tr>
//                   <th>Visitor</th>
//                   <th>Phone</th>
//                   <th>Employee</th>
//                   <th>Visit Date</th>
//                   <th>Arrival</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {visitors.map((visitor) => (
//                   <tr key={visitor._id}>
//                     <td>
//                       <div
//                         className="visitor-name-cell"
//                         title={visitor.visitorName}
//                       >
//                         {visitor.visitorName}
//                       </div>
//                     </td>

//                     <td>
//                       <span className="visitor-phone">{visitor.phone}</span>
//                     </td>

//                     <td>
//                       <div
//                         className="employee-name-cell"
//                         title={
//                           visitor.employee?.name ||
//                           visitor.employee?.employeeName ||
//                           "-"
//                         }
//                       >
//                         {visitor.employee?.name ||
//                           visitor.employee?.employeeName ||
//                           "-"}
//                       </div>
//                     </td>

//                     <td>{formatDate(visitor.visitDate)}</td>

//                     <td>{formatTime(visitor.expectedArrival)}</td>

//                     <td>
//                       <span className={getStatusClass(visitor.status)}>
//                         {formatStatus(visitor.status)}
//                       </span>
//                     </td>

//                     <td>
//                       <button
//                         type="button"
//                         className="visitor-view-btn"
//                         onClick={() =>
//                           navigate(`/receptionist/visitors/${visitor._id}`)
//                         }
//                       >
//                         👁 View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {!loading && visitors.length > 0 && (
//           <div className="visitor-table-footer">
//             <span>
//               Showing 1 to {visitors.length} of {visitors.length} visitors
//             </span>

//             <div className="visitor-pagination">
//               <button disabled>‹</button>
//               <button className="active">1</button>
//               <button disabled>›</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Visitors;

import { useEffect, useState } from "react";
import api from "../../services/api";

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    visitorName: "",
    employeeName: "",
    visitDate: "",
    status: "",
  });

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const fetchVisitors = async (customFilters = filters) => {
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

      setVisitors(response.data?.visitors || []);
    } catch (err) {
      console.error("Fetch visitors error:", err);

      setError(err.response?.data?.message || "Failed to load visitors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    // Status filter immediately applies
    if (name === "status") {
      fetchVisitors(updatedFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisitors();
  };

  const handleClear = () => {
    const emptyFilters = {
      visitorName: "",
      employeeName: "",
      visitDate: "",
      status: "",
    };

    setFilters(emptyFilters);
    fetchVisitors(emptyFilters);
  };

  const handleView = async (id) => {
    try {
      setError("");

      const response = await api.get(`/visitors/${id}`);

      setSelectedVisitor(response.data.visitor);
      setShowDetails(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load visitor details.",
      );
    }
  };

  const handleCheckIn = async (visitor) => {
    const confirmed = window.confirm(`Check in ${visitor.visitorName}?`);

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await api.patch(`/visitors/${visitor._id}/check-in`);

      alert("Visitor checked in successfully.");

      await fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to check in visitor.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async (visitor) => {
    const confirmed = window.confirm(`Check out ${visitor.visitorName}?`);

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await api.patch(`/visitors/${visitor._id}/check-out`);

      alert("Visitor checked out successfully.");

      await fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to check out visitor.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (visitor) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel ${visitor.visitorName}'s visit?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await api.patch(`/visitors/${visitor._id}/cancel`);

      alert("Visitor visit cancelled successfully.");

      await fetchVisitors();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel visitor.");
    } finally {
      setActionLoading(false);
    }
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

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      checked_in: "Checked In",
      checked_out: "Checked Out",
      cancelled: "Cancelled",
    };

    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    return `visitor-status visitor-status-${status}`;
  };

  const renderActions = (visitor) => {
    return (
      <div className="visitor-action-buttons">
        <button
          className="visitor-view-btn"
          onClick={() => handleView(visitor._id)}
          disabled={actionLoading}
        >
          View
        </button>

        {visitor.status === "approved" && (
          <button
            className="visitor-checkin-btn"
            onClick={() => handleCheckIn(visitor)}
            disabled={actionLoading}
          >
            Check In
          </button>
        )}

        {visitor.status === "checked_in" && (
          <button
            className="visitor-checkout-btn"
            onClick={() => handleCheckOut(visitor)}
            disabled={actionLoading}
          >
            Check Out
          </button>
        )}

        {(visitor.status === "pending" || visitor.status === "approved") && (
          <button
            className="visitor-cancel-btn"
            onClick={() => handleCancel(visitor)}
            disabled={actionLoading}
          >
            Cancel
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="receptionist-page">
      {/* HEADER */}
      <div className="receptionist-page-header">
        <div>
          <h1>Visitor Management</h1>

          <p>View and manage registered visitors.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => fetchVisitors()}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* SEARCH */}
      <div className="visitor-search-card">
        <div className="visitor-section-heading">
          <h2>Search Visitors</h2>

          <p>Search by visitor, employee, date or status.</p>
        </div>

        <form className="visitor-filter-grid" onSubmit={handleSearch}>
          <div className="visitor-field">
            <label>Visitor Name</label>

            <input
              type="text"
              name="visitorName"
              placeholder="Visitor name"
              value={filters.visitorName}
              onChange={handleChange}
            />
          </div>

          <div className="visitor-field">
            <label>Employee Name</label>

            <input
              type="text"
              name="employeeName"
              placeholder="Employee name"
              value={filters.employeeName}
              onChange={handleChange}
            />
          </div>

          <div className="visitor-field">
            <label>Visit Date</label>

            <input
              type="date"
              name="visitDate"
              value={filters.visitDate}
              onChange={handleChange}
            />
          </div>

          <div className="visitor-field">
            <label>Status</label>

            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="visitor-filter-actions">
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

      {/* TABLE */}
      <div className="visitor-table-card">
        <div className="visitor-table-header">
          <div>
            <h2>Visitors</h2>

            <p>
              {loading ? "Loading..." : `${visitors.length} visitors found`}
            </p>
          </div>
        </div>

        {error && <div className="visitor-error">{error}</div>}

        {loading ? (
          <div className="visitor-empty">Loading visitors...</div>
        ) : visitors.length === 0 ? (
          <div className="visitor-empty">No visitors found.</div>
        ) : (
          <div className="visitor-table-wrapper">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Phone</th>
                  <th>Employee</th>
                  <th>Visit Date</th>
                  <th>Arrival</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visitors.map((visitor) => (
                  <tr key={visitor._id}>
                    <td>
                      <div className="visitor-name">{visitor.visitorName}</div>

                      {visitor.company && (
                        <div className="visitor-company">{visitor.company}</div>
                      )}
                    </td>

                    <td>{visitor.phone}</td>

                    <td>{visitor.employee?.name || "-"}</td>

                    <td>{formatDate(visitor.visitDate)}</td>

                    <td>{formatTime(visitor.expectedArrival)}</td>

                    <td>
                      <span className={getStatusClass(visitor.status)}>
                        {getStatusLabel(visitor.status)}
                      </span>
                    </td>

                    <td>{renderActions(visitor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {showDetails && selectedVisitor && (
        <div
          className="visitor-modal-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div className="visitor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="visitor-modal-header">
              <div>
                <h2>Visitor Details</h2>

                <p>Complete visitor and visit information.</p>
              </div>

              <button
                className="visitor-modal-close"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            <div className="visitor-details-grid">
              <div>
                <span>Visitor Name</span>
                <strong>{selectedVisitor.visitorName}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{selectedVisitor.phone}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedVisitor.email || "-"}</strong>
              </div>

              <div>
                <span>Company</span>
                <strong>{selectedVisitor.company || "-"}</strong>
              </div>

              <div>
                <span>ID Proof</span>
                <strong>{selectedVisitor.idProofType}</strong>
              </div>

              <div>
                <span>ID Number</span>
                <strong>{selectedVisitor.idProofNumber}</strong>
              </div>

              <div>
                <span>Employee</span>
                <strong>{selectedVisitor.employee?.name || "-"}</strong>
              </div>

              <div>
                <span>Visit Date</span>
                <strong>{formatDate(selectedVisitor.visitDate)}</strong>
              </div>

              <div>
                <span>Expected Arrival</span>
                <strong>{formatTime(selectedVisitor.expectedArrival)}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{getStatusLabel(selectedVisitor.status)}</strong>
              </div>

              <div>
                <span>Check In</span>
                <strong>{formatTime(selectedVisitor.checkInTime)}</strong>
              </div>

              <div>
                <span>Check Out</span>
                <strong>{formatTime(selectedVisitor.checkOutTime)}</strong>
              </div>

              <div className="visitor-detail-full">
                <span>Purpose</span>
                <strong>{selectedVisitor.purpose || "-"}</strong>
              </div>

              <div className="visitor-detail-full">
                <span>Remarks</span>
                <strong>{selectedVisitor.remarks || "-"}</strong>
              </div>
            </div>

            <div className="visitor-modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visitors;