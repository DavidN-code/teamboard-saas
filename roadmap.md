# TeamBoard – Secure Multi-Tenant SaaS Platform

## 🚀 Overview

TeamBoard is a production-style multi-tenant task management platform designed to demonstrate secure SaaS architecture, role-based access control (RBAC), and audit logging.

The goal of this project is to simulate real-world full-stack engineering and SaaS system design rather than build a simple CRUD application.

---

## 🧱 Architecture Overview

### Tech Stack

#### Backend
- Node.js
- Express
- MongoDB (Atlas)
- Mongoose
- JWT (Access Tokens currently implemented, Refresh Tokens planned)
- bcrypt
- express-rate-limit (planned)
- helmet (planned)

#### Frontend
- React
- React Router
- Axios
- Vite

#### Deployment
- Backend → Render (planned)
- Frontend → Vercel (planned)
- Database → MongoDB Atlas

---

## 🔐 Security & System Design

### Implemented
- Multi-tenant data isolation via organizationId
- Role-Based Access Control (Owner, Admin, Member)
- JWT authentication
- Password hashing using bcrypt
- Protected backend routes
- Centralized error handling
- Audit logging system (backend)

### Planned Hardening
- Refresh token authentication system
- Rate limiting (auth + API protection)
- Helmet security headers
- Input validation middleware (Zod or Joi)
- Account lockout after failed login attempts
- Pagination for large datasets

---

## 🧠 Core System Architecture

### Multi-Tenant Model
All resources are scoped by:
- organizationId

Ensures complete data isolation between organizations.

---

### RBAC Flow
1. User authenticates via JWT
2. Middleware extracts user role
3. Authorization middleware validates permissions
4. Access granted or denied based on role hierarchy:
   - Owner → full access
   - Admin → management access
   - Member → limited access

---

### Audit Logging System
Every important mutation (create/update/delete) triggers an audit log entry.

Stored data includes:
- userId
- organizationId
- action type
- resource type
- resourceId
- timestamp

---

## 🏗 Core Data Models

- User
- Organization
- Board
- Task
- AuditLog

---

## 🗂 Backend Folder Structure

backend/
src/
controllers/
middleware/
models/
routes/
services/
utils/
config/
app.js
server.js

---

## 🎯 Frontend Status (CURRENT PHASE)

### Implemented
- React app initialized (Vite)
- Authentication UI (login/register)
- JWT-based authentication
- Protected routes
- Persistent login state
- Logout flow
- Dashboard layout
- API integration via Axios

### Current Behavior
- Users can register and log in
- Authentication persists across refresh
- Dashboard is protected
- API requests are authenticated
- Boards and tasks are fetched from backend

---

## 🧭 Frontend Roadmap (CURRENT PRIORITY)

### Phase 1 — SaaS Layout Foundation (IN PROGRESS)
- Build sidebar-based board navigation system
- Implement ActiveBoardContext (global state)
- Refactor dashboard into layout shell
- Board switching functionality
- Fetch boards in sidebar UI

---

### Phase 2 — Core Product UI Layer
- Create board modal (UI)
- Board list + selection system
- Task filtering by active board
- Task creation UI
- Task list rendering improvements

---

### Phase 3 — SaaS Experience Layer
- Kanban board layout (columns)
- Task cards UI system
- Drag and drop task movement
- Role-based UI differences (Owner/Admin/Member)
- Audit log frontend dashboard

---

## 🚧 Backend Enhancement Roadmap (Post-UI)

- JWT refresh token system
- Rate limiting (express-rate-limit)
- Helmet security headers
- Input validation (Zod/Joi)
- Account lockout system
- Pagination & query optimization
- Deployment to production

---

## 🚀 Deployment Phase

- Backend deployment on Render
- Frontend deployment on Vercel
- MongoDB Atlas production configuration
- Environment variable separation
- Production security review

---

## 🎯 Learning Objectives

This project demonstrates:

- Production-level backend architecture
- Secure multi-tenant SaaS design
- Role-based authorization patterns
- Audit logging systems
- Full-stack integration patterns
- Scalable frontend architecture
- Real-world SaaS development workflow
- Deployment-ready application structure

---

## 👨‍💻 Author

David Neagoy
GitHub: https://github.com/DavidN-code