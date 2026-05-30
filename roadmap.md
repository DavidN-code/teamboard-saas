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
- JWT (implemented with interceptor-based frontend integration)
- bcrypt
- express-rate-limit (planned)
- helmet (planned)

#### Frontend
- React
- React Router
- Axios (with interceptors)
- Vite
- @dnd-kit/core
- @dnd-kit/sortable

#### Deployment
- Backend → Render (planned)
- Frontend → Vercel (planned)
- Database → MongoDB Atlas

---

## 🔐 Security & System Design

### Implemented
- Multi-tenant data isolation via organizationId (backend architecture ready)
- Role-Based Access Control (Owner, Admin, Member) (foundation implemented)
- JWT authentication system
- Password hashing using bcrypt
- Protected backend routes
- Centralized error handling
- Axios interceptor-based authentication flow
- Automatic token injection into API requests
- Automatic 401 handling with redirect to login
- Persistent login using localStorage
- Audit logging system (backend)

### Planned Hardening
- Refresh token authentication system
- Rate limiting (express-rate-limit)
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

### RBAC Flow (Foundation)
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

```
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
```

---

## 🎯 Frontend Status (CURRENT STATE)

### Implemented
- React app initialized (Vite)
- Authentication system implemented (JWT + interceptor-based flow)
- Protected routes system
- Persistent login state
- Logout flow
- Dashboard layout shell
- Sidebar-based board navigation system
- ActiveBoardContext global state system
- Board switching functionality
- Task system fully integrated with backend API
- Kanban-style task organization UI
- Drag-and-drop task movement (@dnd-kit)
- Task modals (create, edit, delete)
- Optimistic UI updates for task movement

### Current Behavior
- Users can register and log in
- Authentication persists across refresh
- API requests are automatically authenticated
- Boards are loaded dynamically
- Tasks are loaded per active board
- Tasks can be created, edited, deleted
- Tasks can be dragged between columns
- UI updates instantly with backend sync

---

## 🧭 Frontend Roadmap

### Phase 1 — Foundation & Layout (COMPLETED)
- Sidebar navigation system
- ActiveBoardContext global state
- Dashboard layout shell
- Board switching system
- API integration setup

---

### Phase 2 — Task System Core (COMPLETED)
- Task CRUD operations (create, update, delete)
- Task modal system (UI + interaction)
- Task filtering by board
- Backend API integration for tasks

---

### Phase 3 — Kanban Interaction Layer (COMPLETED)
- Drag and drop system using @dnd-kit
- Column-based workflow (todo / in-progress / done)
- Optimistic UI updates
- Drag preview overlay
- Task status synchronization with backend

---

### Phase 4 — SaaS Experience Layer (NEXT PRIORITY)
- Role-based UI differences (Owner/Admin/Member)
- Audit log frontend dashboard
- UX polish (animations, smoother drag interactions)
- Better visual hierarchy and spacing improvements

---

## 🚧 Backend Enhancement Roadmap (Post-UI)

- JWT refresh token system
- Rate limiting (express-rate-limit)
- Helmet security headers
- Input validation (Zod/Joi)
- Account lockout system
- Pagination & query optimization
- Production deployment (Render + Vercel)

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