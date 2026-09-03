// import { useEffect, useState } from "react";
// import api from "../../services/api";

// const Visitors = () => {
//   const [visitors, setVisitors] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);

//   const [filters, setFilters] = useState({
//     visitorName: "",
//     employeeName: "",
//     date: "",
//     status: "",
//   });

//   const [formData, setFormData] = useState({
//     visitorName: "",
//     phone: "",
//     email: "",
//     company: "",
//     idProofType: "Aadhar",
//     idProofNumber: "",
//     employee: "",
//     visitDate: "",
//     expectedArrival: "",
//     purpose: "",
//   });

//   // =========================
//   // LOAD VISITORS
//   // =========================

//   const loadVisitors = async (customFilters = filters) => {
//     try {
//       setLoading(true);
//       setError("");

//       const params = {};

//       if (customFilters.visitorName) {
//         params.visitorName = customFilters.visitorName;
//       }

//       if (customFilters.employeeName) {
//         params.employeeName = customFilters.employeeName;
//       }

//       if (customFilters.date) {
//         params.date = customFilters.date;
//       }

//       if (customFilters.status) {
//         params.status = customFilters.status;
//       }

//       const response = await api.get("/visitors", {
//         params,
//       });

//       setVisitors(response.data.visitors || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load visitors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // LOAD EMPLOYEES
//   // =========================

//   const loadEmployees = async () => {
//     try {
//       const response = await api.get("/employees");

//       const activeEmployees = (response.data.employees || []).filter(
//         (employee) => employee.isActive,
//       );

//       setEmployees(activeEmployees);
//     } catch (err) {
//       console.error("Employee loading error:", err);
//     }
//   };

//   useEffect(() => {
//     loadVisitors();
//     loadEmployees();
//   }, []);

//   // =========================
//   // FILTER CHANGE
//   // =========================

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;

//     const updatedFilters = {
//       ...filters,
//       [name]: value,
//     };

//     setFilters(updatedFilters);

//     // Status filter works immediately
//     if (name === "status") {
//       loadVisitors(updatedFilters);
//     }
//   };

//   // =========================
//   // FORM CHANGE
//   // =========================

//   const handleFormChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // =========================
//   // RESET FORM
//   // =========================

//   const resetForm = () => {
//     setFormData({
//       visitorName: "",
//       phone: "",
//       email: "",
//       company: "",
//       idProofType: "Aadhar",
//       idProofNumber: "",
//       employee: "",
//       visitDate: "",
//       expectedArrival: "",
//       purpose: "",
//     });
//   };

//   // =========================
//   // CREATE VISITOR
//   // =========================

//   const handleCreateVisitor = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (
//       !formData.visitorName ||
//       !formData.phone ||
//       !formData.idProofType ||
//       !formData.idProofNumber ||
//       !formData.employee ||
//       !formData.visitDate ||
//       !formData.expectedArrival ||
//       !formData.purpose
//     ) {
//       setError("Please fill all required fields");
//       return;
//     }

//     try {
//       setSaving(true);

//       await api.post("/visitors", formData);

//       setSuccess("Visitor request created successfully");

//       resetForm();
//       setShowForm(false);

//       await loadVisitors();
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to create visitor request",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================
//   // CLEAR FILTERS
//   // =========================

//   const handleClearFilters = () => {
//     const clearedFilters = {
//       visitorName: "",
//       employeeName: "",
//       date: "",
//       status: "",
//     };

//     setFilters(clearedFilters);

//     loadVisitors(clearedFilters);
//   };

//   // =========================
//   // STATUS CLASS
//   // =========================

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "pending":
//         return "status-pending";

//       case "approved":
//         return "status-approved";

//       case "rejected":
//         return "status-rejected";

//       case "checked_in":
//         return "status-checked-in";

//       case "checked_out":
//         return "status-checked-out";

//       case "cancelled":
//         return "status-cancelled";

//       default:
//         return "";
//     }
//   };

//   // =========================
//   // FORMAT STATUS
//   // =========================

//   const formatStatus = (status) => {
//     if (!status) return "-";

//     return status
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (letter) => letter.toUpperCase());
//   };

//   // =========================
//   // FORMAT DATE
//   // =========================

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleDateString();
//   };

//   // =========================
//   // FORMAT TIME
//   // =========================

//   const formatTime = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="page-container">
//       {/* =========================
//           PAGE HEADER
//       ========================= */}

//       <div className="page-header">
//         <div>
//           <h1>Visitor Management</h1>

//           <p>Register, track and manage visitor requests</p>
//         </div>

//         <button
//           type="button"
//           className="primary-button"
//           onClick={() => {
//             setShowForm(true);
//             setError("");
//             setSuccess("");
//           }}
//         >
//           + Register Visitor
//         </button>
//       </div>

//       {/* =========================
//           MESSAGES
//       ========================= */}

//       {error && <div className="alert error-alert">{error}</div>}

//       {success && <div className="alert success-alert">{success}</div>}

//       {/* =========================
//           FILTERS
//       ========================= */}

//       <div className="card filter-card">
//         <div className="filter-grid">
//           {/* Visitor Search */}

//           <input
//             type="text"
//             name="visitorName"
//             placeholder="Search visitor..."
//             value={filters.visitorName}
//             onChange={handleFilterChange}
//           />

//           {/* Employee Search */}

//           <input
//             type="text"
//             name="employeeName"
//             placeholder="Search employee..."
//             value={filters.employeeName}
//             onChange={handleFilterChange}
//           />

//           {/* Date */}

//           <input
//             type="date"
//             name="date"
//             value={filters.date}
//             onChange={handleFilterChange}
//           />

//           {/* Status - Instant Filter */}

//           <select
//             name="status"
//             value={filters.status}
//             onChange={handleFilterChange}
//           >
//             <option value="">All Status</option>

//             <option value="pending">Pending</option>

//             <option value="approved">Approved</option>

//             <option value="rejected">Rejected</option>

//             <option value="checked_in">Checked In</option>

//             <option value="checked_out">Checked Out</option>

//             <option value="cancelled">Cancelled</option>
//           </select>

//           {/* Search */}

//           <button
//             type="button"
//             className="secondary-button search-btn"
//             onClick={() => loadVisitors(filters)}
//           >
//             Search
//           </button>

//           {/* Clear */}

//           <button
//             type="button"
//             className="light-button clear-btn"
//             onClick={handleClearFilters}
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* =========================
//           VISITOR TABLE
//       ========================= */}

//       <div className="card table-card">
//         <div className="table-header">
//           <div>
//             <h2>Visitors</h2>

//             <p>
//               {visitors.length} visitor
//               {visitors.length !== 1 ? "s" : ""}
//             </p>
//           </div>
//         </div>

//         {loading ? (
//           <div className="empty-state">Loading visitors...</div>
//         ) : visitors.length === 0 ? (
//           <div className="empty-state">No visitors found</div>
//         ) : (
//           <div className="visitor-table-wrapper">
//             <table className="visitor-table">
//               <thead>
//                 <tr>
//                   <th>Visitor</th>
//                   <th>Phone</th>
//                   <th>Employee</th>
//                   <th>Date</th>
//                   <th>Arrival</th>
//                   <th>Purpose</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {visitors.map((visitor) => (
//                   <tr key={visitor._id}>
//                     {/* Visitor */}

//                     <td>
//                       <strong>{visitor.visitorName}</strong>

//                       {visitor.company && <small>{visitor.company}</small>}
//                     </td>

//                     {/* Phone */}

//                     <td>{visitor.phone}</td>

//                     {/* Employee */}

//                     <td>{visitor.employee?.name || "-"}</td>

//                     {/* Date */}

//                     <td>{formatDate(visitor.visitDate)}</td>

//                     {/* Arrival */}

//                     <td>{formatTime(visitor.expectedArrival)}</td>

//                     {/* Purpose */}

//                     <td className="purpose-cell">{visitor.purpose}</td>

//                     {/* Status */}

//                     <td>
//                       <span
//                         className={`status-badge ${getStatusClass(
//                           visitor.status,
//                         )}`}
//                       >
//                         {formatStatus(visitor.status)}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* =========================
//           REGISTER VISITOR MODAL
//       ========================= */}

//       {showForm && (
//         <div className="modal-overlay">
//           <div className="modal">
//             {/* Modal Header */}

//             <div className="modal-header">
//               <div>
//                 <h2>Register Visitor</h2>

//                 <p>Create a visitor approval request</p>
//               </div>

//               <button
//                 type="button"
//                 className="close-button"
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             {/* Form */}

//             <form onSubmit={handleCreateVisitor}>
//               <div className="form-grid">
//                 {/* Visitor Name */}

//                 <div className="form-group">
//                   <label>Visitor Name *</label>

//                   <input
//                     type="text"
//                     name="visitorName"
//                     value={formData.visitorName}
//                     onChange={handleFormChange}
//                     placeholder="Enter visitor name"
//                   />
//                 </div>

//                 {/* Phone */}

//                 <div className="form-group">
//                   <label>Phone *</label>

//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleFormChange}
//                     placeholder="Enter phone number"
//                   />
//                 </div>

//                 {/* Email */}

//                 <div className="form-group">
//                   <label>Email</label>

//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleFormChange}
//                     placeholder="Enter email"
//                   />
//                 </div>

//                 {/* Company */}

//                 <div className="form-group">
//                   <label>Company</label>

//                   <input
//                     type="text"
//                     name="company"
//                     value={formData.company}
//                     onChange={handleFormChange}
//                     placeholder="Company name"
//                   />
//                 </div>

//                 {/* ID Proof Type */}

//                 <div className="form-group">
//                   <label>ID Proof Type *</label>

//                   <select
//                     name="idProofType"
//                     value={formData.idProofType}
//                     onChange={handleFormChange}
//                   >
//                     <option value="Aadhar">Aadhar</option>

//                     <option value="Passport">Passport</option>

//                     <option value="Driving License">Driving License</option>

//                     <option value="Voter ID">Voter ID</option>

//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 {/* ID Proof Number */}

//                 <div className="form-group">
//                   <label>ID Proof Number *</label>

//                   <input
//                     type="text"
//                     name="idProofNumber"
//                     value={formData.idProofNumber}
//                     onChange={handleFormChange}
//                     placeholder="Enter ID number"
//                   />
//                 </div>

//                 {/* Employee */}

//                 <div className="form-group">
//                   <label>Employee *</label>

//                   <select
//                     name="employee"
//                     value={formData.employee}
//                     onChange={handleFormChange}
//                   >
//                     <option value="">Select employee</option>

//                     {employees.map((employee) => (
//                       <option key={employee._id} value={employee._id}>
//                         {employee.name} - {employee.employeeId}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Visit Date */}

//                 <div className="form-group">
//                   <label>Visit Date *</label>

//                   <input
//                     type="date"
//                     name="visitDate"
//                     value={formData.visitDate}
//                     onChange={handleFormChange}
//                   />
//                 </div>

//                 {/* Expected Arrival */}

//                 <div className="form-group">
//                   <label>Expected Arrival *</label>

//                   <input
//                     type="datetime-local"
//                     name="expectedArrival"
//                     value={formData.expectedArrival}
//                     onChange={handleFormChange}
//                   />
//                 </div>

//                 {/* Purpose */}

//                 <div className="form-group full-width">
//                   <label>Purpose of Visit *</label>

//                   <textarea
//                     name="purpose"
//                     value={formData.purpose}
//                     onChange={handleFormChange}
//                     placeholder="Enter purpose of visit"
//                     rows="3"
//                   />
//                 </div>
//               </div>

//               {/* Modal Actions */}

//               <div className="modal-actions">
//                 <button
//                   type="button"
//                   className="light-button"
//                   onClick={() => {
//                     setShowForm(false);
//                     resetForm();
//                   }}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="primary-button"
//                   disabled={saving}
//                 >
//                   {saving ? "Registering..." : "Register Visitor"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
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

  const fetchVisitors = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (currentFilters.visitorName.trim()) {
        params.visitorName = currentFilters.visitorName.trim();
      }

      if (currentFilters.employeeName.trim()) {
        params.employeeName = currentFilters.employeeName.trim();
      }

      if (currentFilters.visitDate) {
        params.visitDate = currentFilters.visitDate;
      }

      if (currentFilters.status) {
        params.status = currentFilters.status;
      }

      const response = await api.get("/visitors", { params });

      setVisitors(response.data.visitors || []);
    } catch (err) {
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

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Status should filter immediately
    if (name === "status") {
      fetchVisitors({
        ...filters,
        status: value,
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisitors();
  };

  const handleClear = () => {
    const clearedFilters = {
      visitorName: "",
      employeeName: "",
      visitDate: "",
      status: "",
    };

    setFilters(clearedFilters);
    fetchVisitors(clearedFilters);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Visitor Management</h1>
          <p>View and monitor all registered visitors.</p>
        </div>

        <button className="secondary-btn" onClick={() => fetchVisitors()}>
          Refresh
        </button>
      </div>

      <div className="filter-card">
        <div className="section-heading">
          <h2>Search Visitors</h2>
          <p>Search by visitor, employee, date or status.</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="filter-grid">
            <input
              type="text"
              name="visitorName"
              placeholder="Visitor name"
              value={filters.visitorName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="employeeName"
              placeholder="Employee name"
              value={filters.employeeName}
              onChange={handleChange}
            />

            <input
              type="date"
              name="visitDate"
              value={filters.visitDate}
              onChange={handleChange}
            />

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

            <button type="submit" className="search-btn">
              Search
            </button>

            <button type="button" className="clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div>
            <h2>Visitors</h2>
            <p>
              {visitors.length} visitor
              {visitors.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading visitors...</div>
        ) : visitors.length === 0 ? (
          <div className="empty-state">No visitors found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
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
                      <strong>{visitor.visitorName}</strong>

                      {visitor.company && <small>{visitor.company}</small>}
                    </td>

                    <td>{visitor.phone}</td>

                    <td>{visitor.employee?.name || "-"}</td>

                    <td>{formatDate(visitor.visitDate)}</td>

                    <td>{formatTime(visitor.expectedArrival)}</td>

                    <td>
                      <span className={getStatusClass(visitor.status)}>
                        {visitor.status
                          .replace("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-action-btn"
                        onClick={() => setSelectedVisitor(visitor)}
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
      </div>

      {selectedVisitor && (
        <div className="modal-overlay" onClick={() => setSelectedVisitor(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Visitor Details</h2>
                <p>Review visitor information.</p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() => setSelectedVisitor(null)}
              >
                ×
              </button>
            </div>

            <div className="details-grid">
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
                <strong>
                  {selectedVisitor.status
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </strong>
              </div>

              <div className="details-full">
                <span>Purpose</span>
                <strong>{selectedVisitor.purpose}</strong>
              </div>

              <div className="details-full">
                <span>Remarks</span>
                <strong>{selectedVisitor.remarks || "-"}</strong>
              </div>

              {selectedVisitor.checkInTime && (
                <div>
                  <span>Check In</span>
                  <strong>{formatTime(selectedVisitor.checkInTime)}</strong>
                </div>
              )}

              {selectedVisitor.checkOutTime && (
                <div>
                  <span>Check Out</span>
                  <strong>{formatTime(selectedVisitor.checkOutTime)}</strong>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setSelectedVisitor(null)}
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