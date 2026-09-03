import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/employee/EmployeeRequests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const [remarks, setRemarks] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/visitors/my-requests");

      setRequests(response.data.visitors || []);
    } catch (error) {
      console.error("Failed to load visitor requests:", error);

      setError(
        error.response?.data?.message || "Failed to load visitor requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

 const openActionModal = (visitor, type) => {
   setSelectedRequest(visitor);
   setActionType(type);
   setRemarks("");
   setError("");
 };

  const closeActionModal = () => {
    setSelectedRequest(null);
    setActionType("");
    setRemarks("");
  };

 const handleAction = async () => {
   if (!selectedRequest) return;

   try {
     setActionLoading(selectedRequest._id);
     setError("");

     const endpoint =
       actionType === "approve"
         ? `/visitors/${selectedRequest._id}/approve`
         : `/visitors/${selectedRequest._id}/reject`;

     await api.patch(endpoint, {
       remarks: remarks.trim(),
     });

     closeActionModal();
     await fetchRequests();
   } catch (error) {
     console.error("Visitor request action failed:", error);

     setError(
       error.response?.data?.message || "Unable to update visitor request.",
     );
   } finally {
     setActionLoading("");
   }
 };

  const pendingCount = requests.filter(
    (item) => item.status === "pending",
  ).length;

  const approvedCount = requests.filter(
    (item) => item.status === "approved",
  ).length;

  const rejectedCount = requests.filter(
    (item) => item.status === "rejected",
  ).length;

  return (
    <div className="employee-requests-page">
      {/* PAGE HEADER */}
      <div className="employee-requests-header">
        <div>
          <h1>Visitor Requests</h1>
          <p>Review and manage visitor requests assigned to you.</p>
        </div>

        <button
          type="button"
          className="employee-requests-refresh"
          onClick={fetchRequests}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY */}
      <div className="employee-request-stats">
        <div className="employee-request-stat-card">
          <span>Pending Requests</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="employee-request-stat-card">
          <span>Approved</span>
          <strong>{approvedCount}</strong>
        </div>

        <div className="employee-request-stat-card">
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
        </div>

        <div className="employee-request-stat-card">
          <span>Total Requests</span>
          <strong>{requests.length}</strong>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="employee-request-error">{error}</div>}

      {/* REQUEST CARD */}
      <section className="employee-request-card">
        <div className="employee-request-card-header">
          <div>
            <h2>Visitor Requests</h2>
            <p>Approve or reject visitor requests.</p>
          </div>

          <span className="employee-request-count">
            {requests.length} Request{requests.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="employee-request-empty">
            <div className="employee-request-empty-icon">⏳</div>
            <h3>Loading requests...</h3>
            <p>Please wait while we fetch your visitor requests.</p>
          </div>
        ) : requests.length === 0 ? (
          /* EMPTY */
          <div className="employee-request-empty">
            <div className="employee-request-empty-icon">♟</div>
            <h3>No visitor requests</h3>
            <p>You currently have no visitor requests assigned to you.</p>
          </div>
        ) : (
          /* TABLE */
          <div className="employee-request-table-wrapper">
            <table className="employee-request-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Phone</th>
                  <th>Visit Date</th>
                  <th>Arrival</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((visitor) => (
                  <tr key={visitor._id}>
                    <td>
                      <div className="employee-request-visitor">
                        <strong>{visitor.visitorName}</strong>

                        {visitor.company && <span>{visitor.company}</span>}
                      </div>
                    </td>

                    <td>{visitor.phone}</td>

                    <td>
                      {new Date(visitor.visitDate).toLocaleDateString("en-GB")}
                    </td>

                    <td>
                      {new Date(visitor.expectedArrival).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </td>

                    <td>
                      <span className="employee-request-purpose">
                        {visitor.purpose}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`employee-request-status employee-request-status-${visitor.status}`}
                      >
                        {visitor.status
                          .replace("_", " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </span>
                    </td>

                    <td>
                      {visitor.status === "pending" ? (
                        <div className="employee-request-actions">
                          <button
                            type="button"
                            className="employee-request-approve"
                            onClick={() => openActionModal(visitor, "approve")}
                            disabled={actionLoading === visitor._id}
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            className="employee-request-reject"
                            onClick={() => openActionModal(visitor, "reject")}
                            disabled={actionLoading === visitor._id}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="employee-request-no-action">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ACTION MODAL */}
      {selectedRequest && (
        <div
          className="employee-request-modal-overlay"
          onClick={closeActionModal}
        >
          <div
            className="employee-request-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="employee-request-modal-header">
              <div>
                <h3>
                  {actionType === "approve"
                    ? "Approve Visitor Request"
                    : "Reject Visitor Request"}
                </h3>

                <p>{selectedRequest.visitorName}</p>
              </div>

              <button
                type="button"
                className="employee-request-modal-close"
                onClick={closeActionModal}
              >
                ×
              </button>
            </div>

            <div className="employee-request-modal-body">
              <div className="employee-request-modal-info">
                <div>
                  <span>Visit Date</span>
                  <strong>
                    {new Date(selectedRequest.visitDate).toLocaleDateString(
                      "en-GB",
                    )}
                  </strong>
                </div>

                <div>
                  <span>Arrival</span>
                  <strong>
                    {new Date(
                      selectedRequest.expectedArrival,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>

                <div>
                  <span>Purpose</span>
                  <strong>{selectedRequest.purpose}</strong>
                </div>
              </div>

              <div className="employee-request-remarks">
                <label htmlFor="remarks">
                  Remarks
                  <span>
                    {actionType === "reject" ? " (recommended)" : " (optional)"}
                  </span>
                </label>

                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    actionType === "approve"
                      ? "Add approval remarks..."
                      : "Enter reason for rejection..."
                  }
                  rows="4"
                />
              </div>
            </div>

            <div className="employee-request-modal-footer">
              <button
                type="button"
                className="employee-request-cancel"
                onClick={closeActionModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  actionType === "approve"
                    ? "employee-request-confirm-approve"
                    : "employee-request-confirm-reject"
                }
                onClick={handleAction}
                disabled={actionLoading === selectedRequest._id}
              >
                {actionLoading === selectedRequest._id
                  ? "Processing..."
                  : actionType === "approve"
                    ? "Approve Request"
                    : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
