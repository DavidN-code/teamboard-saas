# teamboard-saas
Secure multi-tenant SaaS task management platform demonstrating RBAC, JWT authentication, and audit logging.
# TeamBoard – Secure Multi-Tenant SaaS Platform

## 🚀 Overview

TeamBoard is a production-style multi-tenant task management platform designed to demonstrate secure SaaS architecture, role-based access control (RBAC), and audit logging.

The goal of this project is to simulate real-world backend system design rather than build a simple CRUD application.

---

## 🧱 Architecture Overview

### Tech Stack

#### Backend
- Node.js
- Express
- MongoDB (Atlas)
- Mongoose
- JWT (Access + Refresh Tokens)
- bcrypt
- express-rate-limit
- helmet

#### Frontend
- React
- React Router
- Axios

#### Deployment
- Backend → Render
- Frontend → Vercel
- Database → MongoDB Atlas

---

## 🔐 Security Design

- Multi-tenant data isolation (organizationId scoping)
- Role-Based Access Control (Owner, Admin, Member)
- JWT authentication with refresh tokens
- Password hashing using bcrypt
- Account lockout after failed login attempts
- Rate limiting for authentication routes
- Centralized input validation middleware
- Structured audit logging system
- No sensitive stack trace exposure in production

---

## 🏗 Core Data Models

- User
- Organization
- Task
- AuditLog

---

## 🗂 Planned Folder Structure

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

frontend/
src/
components/
pages/
context/
services/

---

## 🎯 Learning Objectives

- Demonstrate production-level backend architecture
- Implement secure multi-tenant logic
- Implement RBAC correctly
- Build logging and audit trail system
- Deploy a full-stack application properly
