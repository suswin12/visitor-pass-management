import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const RegisterVisitor = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    email: "",
    company: "",
    idProofType: "",
    idProofNumber: "",
    employee: "",
    visitDate: "",
    expectedArrival: "",
    purpose: "",
  });

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================
  // LOAD EMPLOYEES
  // ============================================

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setError("");

        const response = await api.get("/employees");

        const employeeList = response.data.employees || [];
        console.log("EMPLOYEE LIST FROM API:", employeeList);


        setEmployees(
          employeeList.filter((employee) => employee.isActive !== false),
        );
      } catch (err) {
        console.error("Employee loading error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load employees. Please try again.",
        );
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  // ============================================
  // INPUT CHANGE
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================
  // VALIDATION
  // ============================================

  const validateForm = () => {
    if (!formData.visitorName.trim()) {
      return "Visitor name is required";
    }

    if (!formData.phone.trim()) {
      return "Phone number is required";
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone.trim())) {
      return "Please enter a valid phone number";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      return "Please enter a valid email address";
    }

    if (!formData.idProofType) {
      return "ID proof type is required";
    }

    if (!formData.idProofNumber.trim()) {
      return "ID proof number is required";
    }

    if (!formData.employee) {
      return "Please select an employee";
    }

    if (!formData.visitDate) {
      return "Visit date is required";
    }

    if (!formData.expectedArrival) {
      return "Expected arrival time is required";
    }

    if (!formData.purpose.trim()) {
      return "Purpose of visit is required";
    }

    const selectedDateTime = new Date(
      `${formData.visitDate}T${formData.expectedArrival}`,
    );

    if (Number.isNaN(selectedDateTime.getTime())) {
      return "Please enter a valid visit date and arrival time";
    }

    const today = new Date();

    const selectedDate = new Date(`${formData.visitDate}T00:00:00`);
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      return "Visit date cannot be before today";
    }

    if (
      selectedDate.getTime() === currentDate.getTime() &&
      selectedDateTime < today
    ) {
      return "Expected arrival time cannot be before the current time";
    }

    return "";
  };

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const expectedArrival = new Date(
        `${formData.visitDate}T${formData.expectedArrival}`,
      ).toISOString();

      const visitDate = new Date(
        `${formData.visitDate}T00:00:00`,
      ).toISOString();

      const payload = {
        visitorName: formData.visitorName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        idProofType: formData.idProofType,
        idProofNumber: formData.idProofNumber.trim(),
        employee: formData.employee,
        visitDate,
        expectedArrival,
        purpose: formData.purpose.trim(),
      };

      const response = await api.post("/visitors", payload);

      setSuccess(
        response.data.message ||
          "Visitor registered successfully. Request is pending approval.",
      );

      setFormData({
        visitorName: "",
        phone: "",
        email: "",
        company: "",
        idProofType: "",
        idProofNumber: "",
        employee: "",
        visitDate: "",
        expectedArrival: "",
        purpose: "",
      });
    } catch (err) {
      console.error("Visitor registration error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to register visitor. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // CANCEL
  // ============================================

  const handleCancel = () => {
    navigate("/receptionist/dashboard");
  };

  // ============================================
  // TODAY DATE
  // ============================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="register-visitor-page">
      {/* PAGE HEADER */}

      <div className="register-page-header">
        <div>
          <h1>Register Visitor</h1>

          <p>Create a new visitor request for employee approval.</p>
        </div>

        <button type="button" className="secondary-btn" onClick={handleCancel}>
          Back to Dashboard
        </button>
      </div>

      {/* FORM CARD */}

      <div className="register-card">
        <div className="register-card-header">
          <div>
            <h2>Visitor Details</h2>

            <p>Enter the visitor information and visit schedule.</p>
          </div>

          <span className="required-note">* Required</span>
        </div>

        {/* ERROR */}

        {error && <div className="form-alert error">{error}</div>}

        {/* SUCCESS */}

        {success && <div className="form-alert success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* ======================================
              VISITOR INFORMATION
          ====================================== */}

          <div className="form-section">
            <h3>Visitor Information</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  Visitor Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="visitorName"
                  placeholder="Enter visitor name"
                  value={formData.visitorName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>
                  Phone Number <span>*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Company</label>

                <input
                  type="text"
                  name="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ======================================
              ID PROOF
          ====================================== */}

          <div className="form-section">
            <h3>Identification</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  ID Proof Type <span>*</span>
                </label>

                <select
                  name="idProofType"
                  value={formData.idProofType}
                  onChange={handleChange}
                >
                  <option value="">Select ID proof</option>

                  <option value="Aadhar">Aadhar</option>

                  <option value="Passport">Passport</option>

                  <option value="Driving License">Driving License</option>

                  <option value="Voter ID">Voter ID</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label>
                  ID Proof Number <span>*</span>
                </label>

                <input
                  type="text"
                  name="idProofNumber"
                  placeholder="Enter ID proof number"
                  value={formData.idProofNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ======================================
              VISIT DETAILS
          ====================================== */}

          <div className="form-section">
            <h3>Visit Details</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  Employee <span>*</span>
                </label>

                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                  disabled={loadingEmployees}
                >
                  <option value="">
                    {loadingEmployees
                      ? "Loading employees..."
                      : "Select employee"}
                  </option>

                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                      {employee.employeeId ? ` (${employee.employeeId})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>
                  Visit Date <span>*</span>
                </label>

                <input
                  type="date"
                  name="visitDate"
                  min={getTodayDate()}
                  value={formData.visitDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>
                  Expected Arrival <span>*</span>
                </label>

                <input
                  type="time"
                  name="expectedArrival"
                  value={formData.expectedArrival}
                  onChange={handleChange}
                />

                <small>
                  For today's visit, arrival cannot be earlier than the current
                  time.
                </small>
              </div>

              <div className="form-field full-width">
                <label>
                  Purpose of Visit <span>*</span>
                </label>

                <textarea
                  name="purpose"
                  rows="4"
                  placeholder="Enter the purpose of the visit"
                  value={formData.purpose}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ======================================
              FORM ACTIONS
          ====================================== */}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={submitting || loadingEmployees}
            >
              {submitting ? "Registering..." : "Register Visitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterVisitor;
