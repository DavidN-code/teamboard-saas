# 🚀 TeamBoard – Multi-Tenant Project Management SaaS

TeamBoard is a full-stack SaaS application built to demonstrate production-style software engineering practices including secure authentication, multi-tenant architecture, role-based access control (RBAC), audit logging, team onboarding workflows, and Kanban project management.

The project is being developed as a portfolio-quality application that showcases the skills commonly expected of modern full-stack software developers.

---

# 🎯 Project Objectives

TeamBoard demonstrates the ability to design and build:

* Full-stack web applications
* Multi-tenant SaaS architecture
* Secure authentication systems
* Role-based authorization
* Team onboarding workflows
* RESTful APIs
* Modern React applications
* MongoDB data modeling
* Email integrations
* Audit logging systems
* Production-oriented backend architecture

---

# 🧱 Technology Stack

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt
* Nodemailer

## Frontend

* React
* React Router
* Axios
* Vite
* @dnd-kit/core
* @dnd-kit/sortable

## Planned Production Infrastructure

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Email Service: Resend or SendGrid

---

# 🔐 Authentication & Security

## Implemented

### User Authentication

* User registration
* User login
* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Persistent login sessions
* Automatic unauthorized-session handling

### Security Architecture

* Authorization middleware
* Role-restricted endpoints
* Organization-level data isolation
* Centralized error handling
* Secure invitation token generation
* Environment variable configuration

## Planned

* Refresh token rotation
* Rate limiting
* Helmet security headers
* Input validation (Zod or Joi)
* Account recovery workflows

---

# 🏢 Multi-Tenant SaaS Architecture

TeamBoard uses organization-based tenancy.

Every user belongs to a single organization and all resources are scoped to that organization.

This prevents cross-organization data access and mirrors the architecture commonly used by SaaS platforms such as Slack, Asana, and Notion.

## Implemented

* Organization model
* Organization ownership
* User-to-organization relationships
* Organization-scoped boards
* Organization-scoped tasks
* Organization-scoped member management
* Invitation-based organization onboarding

---

# 🛡 Role-Based Access Control (RBAC)

TeamBoard implements multiple permission levels.

## Roles

### Owner

* Full organization access
* Manage users
* Change user roles
* Remove users
* Create invitations

### Admin

* Manage project resources
* Create invitations
* Limited organization management

### Member

* Standard workspace access

## Implemented

* User role model
* Authorization middleware
* Role-protected routes
* Owner-only user management
* Owner-only role changes
* Role-aware frontend rendering

---

# 👥 Organization Management & Team Onboarding

TeamBoard includes a complete invitation-based onboarding system.

## Member Management

### Implemented

* Organization member directory
* Role management interface
* User removal workflow
* Role update API
* Permission-based controls

## Invitation System

### Implemented

* Invitation creation
* Secure invitation tokens
* Invitation validation endpoint
* Pending invitation tracking
* Invitation status management
* Invitation revocation
* Email invitation delivery
* Invitation-aware registration flow

### Invitation Workflow

1. Owner/Admin creates invitation
2. Secure token generated
3. Invitation stored in MongoDB
4. Email invitation delivered
5. User opens invitation link
6. Registration form validates invitation
7. Email auto-filled and locked
8. User joins organization automatically
9. Invitation marked accepted

### Invitation Status Tracking

* Pending
* Accepted

---

# 📧 Email Integration

TeamBoard includes transactional email delivery for organization invitations.

## Implemented

* Nodemailer integration
* Gmail SMTP configuration
* Environment-based credentials
* HTML email templates
* Invitation acceptance links

## Planned

* Production email provider migration
* Resend invitation workflow
* Invitation expiration system
* Email branding improvements

---

# 📋 Boards & Tasks

## Boards

### Implemented

* Create boards
* View boards
* Update boards
* Delete boards
* Active board switching
* Organization-scoped board access

## Tasks

### Implemented

* Create tasks
* Edit tasks
* Delete tasks
* Task status management
* Board filtering
* Optimistic UI updates

---

# 🖱 Kanban Workflow System

Built using @dnd-kit.

## Implemented

* Drag-and-drop task movement
* Todo column
* In Progress column
* Done column
* Backend synchronization
* Drag overlays
* Optimistic state updates

---

# 📜 Audit Logging System

TeamBoard includes a centralized audit logging system.

## Implemented

### Audit Log Features

* Audit log model
* Audit log API
* Audit log UI
* Pagination
* Filtering
* User population

### Tracked Actions

* Board creation
* Board updates
* Board deletion
* Task creation
* Task updates
* Task deletion

This provides visibility into organizational activity and demonstrates event-tracking architecture.

---

# ⚡ API Architecture

## Centralized Axios Client

* Shared API client
* Automatic JWT injection
* Authentication handling
* Consistent request patterns

## REST API

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Boards

* GET /api/boards
* POST /api/boards
* PUT /api/boards/:id
* DELETE /api/boards/:id

### Tasks

* GET /api/tasks/board/:boardId
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

### Users

* GET /api/users
* PUT /api/users/:id/role
* DELETE /api/users/:id

### Invitations

* POST /api/invitations
* GET /api/invitations
* GET /api/invitations/token/:token
* DELETE /api/invitations/:id

### Audit Logs

* GET /api/audit-logs

---

# 📂 Project Structure

backend/
├── src/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── app.js
│ └── server.js

frontend/
├── src/
│ ├── api/
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── App.jsx
│ └── main.jsx

---

# 🚧 Current Development Roadmap

## Next Milestone

### Invitation System Enhancements

* Invitation expiration
* Resend invitation functionality
* Enhanced email templates

### Dashboard Enhancements

* Organization metrics
* Task analytics
* Activity summaries
* Team insights

### Collaboration Features

* Comments
* Notifications
* Activity feeds

### Production Readiness

* Automated testing
* Validation layer
* Security hardening
* Cloud deployment

---

# 🧪 Engineering Concepts Demonstrated

* Multi-tenant SaaS architecture
* JWT authentication
* Authorization middleware
* Role-Based Access Control (RBAC)
* Secure token generation
* Email workflow integration
* React Context API
* Axios interceptors
* RESTful API design
* MongoDB data modeling
* Audit logging
* Optimistic UI updates
* Drag-and-drop interfaces
* Environment-based configuration
* Organization onboarding workflows

---

# 👨‍💻 Author

David Neagoy

GitHub:
https://github.com/DavidN-code
