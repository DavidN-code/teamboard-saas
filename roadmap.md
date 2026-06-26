# TeamBoard – Multi-Tenant Project Management SaaS

## 🚀 Project Vision

TeamBoard is a production-oriented multi-tenant SaaS application designed to demonstrate the architecture, security practices, and engineering patterns commonly found in modern software products.

The project focuses on solving real-world business problems such as organization management, team onboarding, access control, auditability, notifications, collaboration, and project tracking while showcasing full-stack development skills.

---

# 🎯 Engineering Goals

This project is designed to demonstrate proficiency in:

* Full-stack application development
* Multi-tenant SaaS architecture
* Secure authentication and authorization
* Role-Based Access Control (RBAC)
* Team onboarding workflows
* Transactional email systems
* Audit logging and activity tracking
* Notification systems
* Collaboration systems
* REST API design
* MongoDB data modeling
* Modern React application architecture
* Production-ready backend development

---

# 🧱 Technology Stack

## Backend

* Node.js
* Express
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

* Backend → Render
* Frontend → Vercel
* Database → MongoDB Atlas
* Email Delivery → Resend or SendGrid

---

# 🔐 Security & Authentication

## Completed

### Authentication

* User registration
* User login
* JWT authentication
* Protected API routes
* Persistent login sessions
* Automatic unauthorized-session handling

### Security Foundations

* Password hashing with bcrypt
* Authorization middleware
* Role-restricted endpoints
* Secure invitation token generation
* Environment-based configuration
* Centralized error handling

## Planned

* Refresh token architecture
* Rate limiting
* Helmet security headers
* Input validation layer (Zod or Joi)
* Account lockout protection
* Password reset workflow

---

# 🏢 Multi-Tenant Architecture

## Completed

### Organization System

* Organization model
* Organization ownership
* User-to-organization relationships
* Organization-scoped boards
* Organization-scoped tasks
* Organization-scoped users
* Organization-scoped invitations
* Organization-scoped comments
* Organization-scoped notifications
* Organization-scoped audit logs

### Data Isolation

* Organization-level access control
* Resource ownership enforcement
* Multi-tenant authorization architecture

---

# 🛡 Role-Based Access Control (RBAC)

## Completed

### User Roles

* Owner
* Admin
* Member

### Backend Authorization

* Authorization middleware
* Role-restricted endpoints
* Owner-only management actions
* Organization-level permission enforcement

### Frontend Controls

* Role-aware rendering
* Owner-only controls
* Permission-based actions

### Organization Administration

* Change user roles
* Remove users
* Invitation permissions

---

# 👥 Team Onboarding & Organization Management

## Completed

### Member Management

* Organization Members page
* User listing table
* Role display
* Role editing
* User removal workflow

### Invitation System

* Invitation model
* Invitation API
* Invitation token generation
* Invitation token validation
* Pending invitation tracking
* Invitation status tracking
* Invitation revocation

### Invitation Workflow

* Create invitation
* Generate secure token
* Store invitation
* Email invitation delivery
* Invitation validation
* Auto-detect invitation during registration
* Auto-fill invited email
* Lock invited email field
* Automatic organization assignment
* Automatic member role assignment
* Invitation acceptance tracking

### Email Delivery

* Nodemailer integration
* Gmail SMTP configuration
* HTML invitation emails
* Invitation acceptance links

---

# 📋 Project Management Features

## Boards

### Completed

* Create boards
* View boards
* Update boards
* Delete boards
* Active board switching
* Organization-scoped board access

## Tasks

### Completed

* Create tasks
* Edit tasks
* Delete tasks
* Status tracking
* Board filtering
* Optimistic updates
* Task assignment
* Task creator tracking
* Task Details Modal
* Task activity timeline
* Task comments

---

# 🖱 Kanban Workflow System

## Completed

* Drag-and-drop task management
* Todo column
* In Progress column
* Done column
* Backend synchronization
* Drag overlay previews
* Optimistic UI updates

---

# 📜 Audit Logging

## Completed

### Audit System

* Audit log model
* Audit log API
* Audit log frontend page
* Pagination
* Filtering
* User population
* Task activity endpoint

### Tracked Activity

#### Boards

* CREATE_BOARD
* UPDATE_BOARD
* DELETE_BOARD

#### Tasks

* CREATE_TASK
* UPDATE_TASK
* DELETE_TASK
* ASSIGN_TASK

#### Comments

* CREATE_COMMENT
* UPDATE_COMMENT
* DELETE_COMMENT

## Planned

* Invitation activity logging
* User management logging
* Organization administration logging

---

# 🔔 Notifications

## Completed

### Notification System

* Notification model
* Notification API
* Notification Bell UI
* Unread counts
* Mark as read
* Notification persistence
* Click-to-open task navigation

### Notification Types

* TASK_ASSIGNED
* TASK_COMMENT

---

# 💬 Collaboration Features

## Completed

### Comments

* Create comments
* Edit comments
* Delete comments
* Comment history
* User attribution
* Comment notifications

### Activity Feed

* Organization-wide activity feed
* Human-readable activity messages
* Assignment tracking
* Comment tracking

### Task Activity Timeline

* Task-specific audit history
* Activity icons
* User attribution
* Assignment history
* Comment history

---

# 📊 Dashboard Metrics

## Completed

### Metrics Endpoint

* User count
* Board count
* Total task count
* Todo count
* In Progress count
* Done count

### Dashboard Cards

* Users
* Boards
* Tasks
* Todo
* In Progress
* Done

---

# ⚡ API Architecture

## Completed

### Axios Infrastructure

* Centralized API client
* Automatic JWT injection
* Global authentication handling
* Consistent request architecture

### REST API Modules

* Authentication
* Boards
* Tasks
* Comments
* Notifications
* Users
* Invitations
* Audit Logs
* Dashboard Metrics

---

# 🗺 Development Roadmap

## Phase 1 — Authentication & Foundations ✅ Complete

* Registration
* Login
* JWT authentication
* Protected routes
* Axios interceptors
* Persistent sessions

---

## Phase 2 — Boards & Tasks ✅ Complete

* Board CRUD
* Task CRUD
* Board-task relationships
* Active board management

---

## Phase 3 — Kanban Workflow ✅ Complete

* Drag-and-drop task movement
* Workflow columns
* Status synchronization
* Optimistic updates

---

## Phase 4 — Organization Management ✅ Complete

### User Administration

* Role management
* Permission enforcement
* User removal

### Team Onboarding

* Invitation creation
* Invitation validation
* Invitation acceptance workflow
* Organization assignment
* Email delivery

---

## Phase 5 — Collaboration Systems ✅ Complete

### Collaboration

* Comments
* Notifications
* Activity Feed
* Task Assignment Tracking
* Task Activity Timeline

---

## Phase 6 — Dashboard Analytics ✅ Complete

### Dashboard

* Organization metrics
* User counts
* Board counts
* Task counts
* Workflow status metrics

---

## Phase 7 — Invitation System Enhancements 🚧 Current Focus

### Invitation Improvements

* Invitation expiration
* Resend invitation functionality
* Invitation analytics
* Improved email templates

### Email Infrastructure

* Migration to production email provider
* Delivery monitoring
* Email branding

---

## Phase 8 — Advanced Task Management

### Task Features

* Task priorities
* Due dates
* Search
* Filtering
* Sorting

Phase 8 — Advanced Task Management 🚧

Completed:

### Task Features

✅ Priorities
✅ Due Dates
✅ Search
✅ Filtering
✅ Sorting
✅ Sorting
✅ overdue indicators
comments

---

## Phase 9 — Production Readiness

### Deployment

* Render backend deployment
* Vercel frontend deployment
* Production environment configuration

### Security

* Refresh tokens
* Validation layer
* Rate limiting
* Helmet

### Testing

* Backend API testing
* Frontend testing
* Integration testing
* End-to-end testing

---

# 🎯 Portfolio Value

TeamBoard demonstrates experience with:

* Multi-tenant SaaS architecture
* JWT authentication
* Role-Based Access Control (RBAC)
* Secure onboarding workflows
* Email integrations
* Audit logging systems
* Notification systems
* Collaboration systems
* React state management
* RESTful API design
* MongoDB data modeling
* Secure backend development
* Modern frontend architecture
* Production-oriented engineering practices

---

# 👨‍💻 Author

David Neagoy

GitHub:
https://github.com/DavidN-code
