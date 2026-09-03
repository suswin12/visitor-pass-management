# Visitor Pass Management System

A full-stack **MERN (MongoDB, Express.js, React, Node.js)** application for managing visitor registration, employee approvals, check-in/check-out, reports, and activity history.

## Live Application

- Frontend: https://visitor-pass-management-ffm8dri41-suswin.vercel.app
- Backend API: https://visitor-pass-backend-4wnq.onrender.com
- Health Check: https://visitor-pass-backend-4wnq.onrender.com/api/health

## Project Structure

```text
visitor-pass-management/
├── client/    # React + Vite frontend
└── server/    # Node.js + Express backend
```

## Features

### Authentication & Authorization
- JWT authentication with HTTP-only cookies
- Protected frontend routes and backend APIs
- Role-based navigation and authorization
- User account activation/deactivation

### Administrator
- Dashboard
- Employee management
- User account management
- Visitor management
- Visitor reports
- Activity history

### Receptionist
- Register visitors
- Select employee and visit schedule
- View visitor management records
- Check-in approved visitors
- Check-out visitors
- Cancel eligible visits
- Search and filter visitor history

### Employee
- Dashboard
- View assigned visitor requests
- Approve or reject requests
- Add remarks

## Visitor Workflow

```text
Receptionist
    |
    v
Register Visitor
    |
    v
Pending Request
    |
    +---- Employee Approves ----> Approved
    |                                |
    |                                v
    |                         Receptionist Check-In
    |                                |
    |                                v
    |                         Visitor Inside
    |                                |
    |                                v
    |                         Receptionist Check-Out
    |                                |
    |                                v
    |                           Visit History
    |
    +---- Employee Rejects ----> Rejected
```

A receptionist can also cancel an eligible visit before check-in.

## Business Rules

The backend enforces:

1. A visitor cannot have more than one active visit at the same time.
2. Duplicate visitor registration on the same date is not allowed.
3. Visit date cannot be before the current date.
4. For today's visit, expected arrival cannot be before the current time.
5. An employee can have a maximum of 3 pending visitor requests.
6. Check-in is allowed only after employee approval.
7. An already checked-in visitor cannot check in again until checkout.
8. Checkout must happen after check-in.
9. Rejected visitors cannot be checked in.
10. Cancelled visits are excluded from active visitor lists.

## Reports

Administrators can generate reports for:
- Today
- This week
- Custom date range

Statistics include total visitors, pending, approved, rejected, checked-in, checked-out, cancelled, completed visits, and approval rate.

## Search & Filters

Visitor records support filtering by:
- Visitor name
- Employee name
- Visit date
- Status

## Activity History

The system records:
- Created
- Approved
- Rejected
- Checked In
- Checked Out
- Cancelled

Each activity stores the visitor, performing user, details, and timestamp.

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- Helmet
- CORS
- Cookie Parser
- Express Rate Limit

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Local Setup

### Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB Atlas account or local MongoDB

### Clone

```bash
git clone https://github.com/suswin12/visitor-pass-management.git
cd visitor-pass-management
```

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Production Environment Variables

### Backend

```env
MONGODB_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_production_frontend_url
NODE_ENV=production
```

The hosting platform provides the production `PORT`.

### Frontend

```env
VITE_API_URL=https://your-backend-domain/api
```

Never commit real secrets or `.env` files to GitHub.

## API Overview

Base URL:

```text
/api
```

### Authentication

```text
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

### Employees

```text
POST   /api/employees
GET    /api/employees
GET    /api/employees/:id
PATCH  /api/employees/:id
```

### User Accounts

```text
POST   /api/users
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id/status
PATCH  /api/users/:id/role
```

User account management is administrator-only.

### Visitors

```text
POST   /api/visitors
GET    /api/visitors
GET    /api/visitors/my-requests
GET    /api/visitors/:id

PATCH  /api/visitors/:id/approve
PATCH  /api/visitors/:id/reject
PATCH  /api/visitors/:id/check-in
PATCH  /api/visitors/:id/check-out
PATCH  /api/visitors/:id/cancel
```

Access is controlled by role.

### Reports

```text
GET /api/reports
```

Supports today, this week, and custom date ranges.

### Activity History

```text
GET /api/activity
GET /api/activity/:id
```

Activity history is administrator-only.

## Project Structure

```text
visitor-pass-management/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Security

- Passwords are hashed using bcryptjs.
- JWT is stored in an HTTP-only cookie.
- Authentication middleware protects private APIs.
- Backend role authorization prevents unauthorized operations.
- Helmet provides security-related HTTP headers.
- CORS is restricted to the configured frontend origin.
- API rate limiting is enabled.
- Environment secrets are kept outside source control.

## Validation & Error Handling

The application validates required visitor details, date/time rules, employee availability, pending request limits, duplicate registrations, visitor status transitions, authentication, and authorization.

API errors return appropriate HTTP status codes and descriptive messages.

## Deployment

### Frontend

Deployed from `client` using Vercel.

```bash
npm run build
```

Output:

```text
dist
```

### Backend

Deployed from `server` using Render.

```bash
npm install
npm start
```

### Database

MongoDB Atlas is used as the production database.

## Testing Checklist

The following flows were verified during development:

- Admin login
- Receptionist login
- Employee login
- Employee creation and management
- User account creation and status management
- Visitor registration
- Employee approval
- Employee rejection
- Receptionist check-in
- Receptionist check-out
- Visitor cancellation
- Duplicate visitor validation
- Active visitor validation
- Past-date validation
- Current-time validation
- Maximum pending-request validation
- Double check-in validation
- Rejected visitor check-in validation
- Checkout timing validation
- Visitor search and filtering
- Reports
- Activity history
- Production frontend/backend connectivity

## Roles

| Role | Main Responsibilities |
|---|---|
| Administrator | Dashboard, employees, users, visitors, reports, activity history |
| Receptionist | Register visitors, check-in/out, cancellation, visitor history |
| Employee | View requests, approve/reject, add remarks |

## License

This project was developed as an assessment/project submission.
