# 🚀 TeamBoard – Multi-Tenant Project Management SaaS

TeamBoard is a full-stack SaaS application designed to demonstrate modern software engineering practices, including secure authentication, role-based access control (RBAC), audit logging, multi-tenant architecture, and Kanban-style project management.

The project is being built as a portfolio-quality application to showcase skills commonly required of full-stack software developers.

---

# 🎯 Project Goals

TeamBoard is designed to demonstrate:

* Full-stack application development
* JWT authentication and authorization
* Multi-tenant SaaS architecture
* Role-based access control (RBAC)
* Audit logging systems
* React frontend architecture
* RESTful API design
* MongoDB data modeling
* Secure backend development practices

---

# 🧱 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt

## Frontend

* React
* React Router
* Axios
* Vite
* @dnd-kit/core
* @dnd-kit/sortable

## Planned Deployment

* Backend → Render
* Frontend → Vercel
* Database → MongoDB Atlas

---

# 🔐 Authentication & Security

## Implemented

* User registration
* User login
* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Axios interceptor authentication flow
* Persistent login using localStorage
* Automatic unauthorized-session handling
* Centralized error handling

## Planned

* Refresh token authentication
* Rate limiting
* Helmet security headers
* Input validation layer (Zod or Joi)

---

# 🏢 Multi-Tenant Architecture

TeamBoard uses organization-based isolation.

Each user belongs to an organization and application resources are scoped to that organization.

## Implemented

* Organization model
* Organization ownership
* User-to-organization relationships
* Organization-scoped user access
* Organization-scoped boards
* Organization-scoped tasks

This architecture helps ensure data isolation between organizations.

---

# 🛡 Role-Based Access Control (RBAC)

TeamBoard supports multiple permission levels.

## Roles

### Owner

* Full access
* Manage organization members
* Change user roles
* Remove users

### Admin

* Manage project resources
* Limited user management

### Member

* Standard workspace access

## Implemented

* Role field on users
* Authorization middleware
* Protected role-based endpoints
* Owner/Admin route restrictions

---

# 📋 Boards & Tasks

## Boards

Implemented:

* Create boards
* View boards
* Switch active boards
* Organization-scoped board access

## Tasks

Implemented:

* Create tasks
* Update tasks
* Delete tasks
* Status management
* Board filtering
* Optimistic UI updates

---

# 🖱 Kanban Workflow System

Built using @dnd-kit.

Features:

* Drag-and-drop tasks
* Todo column
* In Progress column
* Done column
* Backend synchronization
* Drag preview overlay
* Optimistic updates

---

# 📜 Audit Logging

TeamBoard includes a working audit logging system.

## Implemented

* Audit log model
* Audit log API
* Audit log frontend page
* Pagination
* Filtering
* User population

Tracked actions include:

* Board creation
* Board updates
* Board deletion
* Task creation
* Task updates
* Task deletion

---

# 👥 Organization Members

TeamBoard includes organization member management foundations.

## Implemented

### Backend

* User management API
* Organization user retrieval endpoint
* Role-restricted user routes

### Frontend

* Organization Members page
* Member listing table
* User name display
* User email display
* User role display

---

# ⚡ API Architecture

## Axios Client

Centralized API architecture:

* Shared Axios instance
* Automatic JWT injection
* Global authentication handling
* Consistent API requests

## REST API

Authentication:

* POST /api/auth/register
* POST /api/auth/login

Boards:

* GET /api/boards
* POST /api/boards
* PUT /api/boards/:id
* DELETE /api/boards/:id

Tasks:

* GET /api/tasks/board/:boardId
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

Audit Logs:

* GET /api/audit-logs

Users:

* GET /api/users
* PUT /api/users/:id/role
* DELETE /api/users/:id

---

# 📂 Project Structure

backend/
src/
controllers/
middleware/
models/
routes/
utils/
app.js
server.js

frontend/
src/
api/
components/
context/
pages/
App.jsx
main.jsx

---

# 🚧 Current Development Priorities

## Priority 1 – Organization & Access Management

* Role badges
* Role management UI
* Frontend permission enforcement
* User removal workflow

## Priority 2 – Dashboard Enhancements

* User metrics
* Board metrics
* Task metrics
* Activity summaries

## Priority 3 – Team Collaboration

* User invitations
* Team onboarding workflows

## Priority 4 – Production Readiness

* Deployment
* Validation layer
* Security hardening
* Testing

---

# 🧪 Engineering Concepts Demonstrated

* JWT authentication
* Authorization middleware
* RBAC
* Multi-tenant architecture
* Audit logging
* React Context API
* Axios interceptors
* Optimistic UI updates
* Drag-and-drop interfaces
* REST API design
* MongoDB data modeling

---

# 👨‍💻 Author

David Neagoy

GitHub:
https://github.com/DavidN-code
