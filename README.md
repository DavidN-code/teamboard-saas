# 🚀 TeamBoard – Secure Multi-Tenant SaaS Platform

TeamBoard is a production-style, full-stack SaaS application designed to demonstrate secure backend architecture, multi-tenant data isolation, role-based access control (RBAC), and audit logging.

This project focuses on building real-world backend systems that reflect how modern SaaS platforms are structured and secured.

---

## 🧠 Overview

TeamBoard allows users to:

- Create and manage organizations
- Collaborate using boards and tasks
- Enforce role-based permissions
- Track system activity through audit logs

The goal is to simulate a **real-world SaaS backend**, not just a simple CRUD app.

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

### Frontend (planned)
- React
- React Router
- Axios

### Deployment (planned)
- Backend → Render
- Frontend → Vercel
- Database → MongoDB Atlas

---

## 🔐 Core Features

### Authentication & Security
- User registration and login with JWT authentication
- Password hashing using bcrypt
- Protected API routes
- Multi-tenant data isolation via `organizationId`

---

### 🛡 Role-Based Access Control (RBAC)
- Roles: **Owner, Admin, Member**
- Middleware-based authorization
- Fine-grained access control on:
  - Boards
  - Tasks
  - Audit logs

---

### 🏢 Multi-Tenant Architecture
- Users belong to organizations
- All data is scoped by `organizationId`
- Prevents cross-organization data access

---

### 📋 Boards & Tasks

#### Boards
- Create, read, update, delete boards
- Organization-scoped access

#### Tasks
- Full CRUD operations
- Assigned users
- Status tracking (todo, in-progress, etc.)
- Organization-scoped access

---

### 📜 Audit Logging System (Advanced Feature)
- Automatic logging of:
  - Task actions (create, update, delete)
  - Board actions (create, update, delete)
- Stores:
  - userId
  - organizationId
  - resourceId
  - timestamps

---

### 🔎 Audit Logs API
- Secure endpoint: `GET /api/audit-logs`
- RBAC protected (Owner/Admin only)
- Organization-based filtering
- Query support:
  - `action`
  - `resourceType`
  - `limit` (performance control)
- Sorted by newest activity

---

## 📂 Project Structure

~~~
backend/
  src/
    controllers/
    middleware/
    models/
    routes/
    utils/
  app.js
  server.js
~~~

---

## ⚙️ Getting Started

### 1. Clone the repository

~~~bash
git clone https://github.com/DavidN-code/teamboard-saas.git
cd teamboard-saas/backend
~~~

### 2. Install dependencies

~~~bash
npm install
~~~

### 3. Create environment variables

Create a `.env` file:

~~~
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5050
~~~

### 4. Run the server

~~~bash
npm start
~~~

Server runs at:

~~~
http://localhost:5050
~~~

---

## 🔐 API Usage

### Authentication

- POST /api/auth/register
- POST /api/auth/login

---

### Boards (Protected)

- GET /api/boards
- POST /api/boards
- GET /api/boards/:id
- PUT /api/boards/:id
- DELETE /api/boards/:id

---

### Tasks (Protected)

- GET /api/tasks
- POST /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

---

### Audit Logs (Protected – Owner/Admin only)

- GET /api/audit-logs

Optional query params:
- action=CREATE_TASK
- resourceType=Board
- limit=10

---

## 🧪 Example Request

~~~bash
curl http://localhost:5050/api/audit-logs \
-H "Authorization: Bearer YOUR_TOKEN"
~~~

---

## 🎯 Learning Objectives

This project demonstrates:

- Production-level backend architecture
- Secure multi-tenant SaaS design
- Role-based authorization patterns
- Audit logging systems
- REST API best practices

---

## 🚧 Future Improvements

- Refresh token implementation
- Rate limiting & enhanced security
- Input validation middleware (Joi/Zod)
- Frontend UI (React)
- Full deployment (Render + Vercel)

---

## 👨‍💻 Author

David Neagoy  
https://github.com/DavidN-code