import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Login
import Login from "./pages/Login";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import Users from "./pages/admin/Users";

// Receptionist pages
import ReceptionistDashboard from "./pages/receptionist/Dashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ReceptionistLayout from "./components/receptionist/ReceptionistLayout";
import RegisterVisitor from "./pages/receptionist/RegisterVisitor";
import ReceptionistVisitors from "./pages/receptionist/Visitors";
import History from "./pages/receptionist/History";
import VisitorHistory from "./pages/receptionist/VisitorHistory";
// import ReceptionistVisitors from "./pages/receptionist/Visitors";

import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeLayout from "./components/employee/EmployeeLayout";
// import EmployeeDashboard from "./pages/employee/Dashboard";
import ActivityHistory from "./pages/admin/ActivityHistory";

import Reports from "./pages/admin/Reports";
import Visitors from "./pages/admin/Visitors";
import EmployeeRequests from "./pages/employee/Requests";
// import EmployeeDashboard from "./pages/employee/Dashboard";
// import EmployeeLayout from "./components/employee/EmployeeLayout";

// ============================================
// ADMIN PAGE WRAPPER
// ============================================

const AdminPage = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["administrator"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
};

// ============================================
// RECEPTIONIST PAGE WRAPPER
// ============================================

const ReceptionistPage = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <ReceptionistLayout>{children}</ReceptionistLayout>
    </ProtectedRoute>
  );
};

// ============================================
// UNAUTHORIZED
// ============================================

const Unauthorized = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>403 - Unauthorized</h1>

      <p>You do not have permission to access this page.</p>
    </div>
  );
};

// ============================================
// PLACEHOLDER
// ============================================

const Placeholder = ({ title }) => {
  return (
    <div className="placeholder-page">
      <h1>{title}</h1>

      <p>This module is coming next.</p>
    </div>
  );
};

// ============================================
// APP
// ============================================

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================================
            AUTH
        ====================================== */}

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        {/* ======================================
            ADMIN
        ====================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminPage>
              <AdminDashboard />
            </AdminPage>
          }
        />

        <Route
          path="/admin/employees"
          element={
            <AdminPage>
              <Employees />
            </AdminPage>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminPage>
              <Users />
            </AdminPage>
          }
        />

        <Route
          path="/admin/visitors"
          element={
            <AdminPage>
              <Visitors />
            </AdminPage>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminPage>
              <Reports />
            </AdminPage>
          }
        />

        <Route
          path="/admin/activity"
          element={
            <AdminPage>
              <ActivityHistory />
            </AdminPage>
          }
        />

        {/* ======================================
            RECEPTIONIST
        ====================================== */}

        <Route
          path="/receptionist/dashboard"
          element={
            <ReceptionistPage>
              <ReceptionistDashboard />
            </ReceptionistPage>
          }
        />

        <Route
          path="/receptionist/register"
          element={
            <ReceptionistPage>
              <RegisterVisitor />
            </ReceptionistPage>
          }
        />

        <Route
          path="/receptionist/visitors"
          element={
            <ReceptionistPage>
              <ReceptionistVisitors />
            </ReceptionistPage>
          }
        />

        <Route
          path="/receptionist/history"
          element={
            <ReceptionistPage>
              <VisitorHistory />
            </ReceptionistPage>
          }
        />
        {/* ======================================
    EMPLOYEE
====================================== */}

        <Route
          path="/employee/"
          element={<Navigate to="/employee/dashboard" replace />}
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeLayout>
                <EmployeeDashboard />
              </EmployeeLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/requests"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeLayout>
                <EmployeeRequests />
              </EmployeeLayout>
            </ProtectedRoute>
          }
        />
        {/* ======================================
            UNAUTHORIZED
        ====================================== */}

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
