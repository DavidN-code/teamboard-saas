# TeamBoard – Multi-Tenant Project Management SaaS

# 🚀 Project Vision

TeamBoard is a production-oriented multi-tenant SaaS application designed to demonstrate the architecture, security practices, and engineering patterns commonly found in modern software products.

The project focuses on solving real-world business problems such as organization management, team onboarding, access control, audit logging, notifications, real-time collaboration, and project tracking while showcasing modern full-stack software engineering.

---

# 📍 Current Development Status

TeamBoard is feature-complete in most core areas and has entered the production polish phase.

## Completed Systems

* Authentication
* JWT authorization
* Multi-tenant organization architecture
* Role-Based Access Control (RBAC)
* Organization invitations
* Email invitation workflow
* Boards
* Tasks
* Kanban board
* Task assignment
* Comments
* Notifications
* Audit logging
* Organization Activity Feed
* Task Activity Timeline
* Dashboard metrics
* My Tasks
* Task search, filtering, and sorting
* Organization member management
* Security middleware

## Current Development Focus

* Real-time synchronization
* Production polish
* Testing
* Deployment preparation
* Portfolio refinement

---

# 🎯 Engineering Goals

TeamBoard is intended to demonstrate proficiency in:

* Full-stack application development
* Multi-tenant SaaS architecture
* Secure authentication and authorization
* Role-Based Access Control (RBAC)
* Team onboarding workflows
* Transactional email systems
* Audit logging
* Real-time collaboration
* Notification systems
* REST API design
* MongoDB data modeling
* Modern React architecture
* Production-ready backend engineering

---

# 🧱 Technology Stack

## Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt
* Nodemailer
* Pusher

## Frontend

* React
* React Router
* Axios
* Vite
* @dnd-kit/core
* @dnd-kit/sortable
* Pusher JS

## Planned Production Infrastructure

* Backend → Render
* Frontend → Vercel
* Database → MongoDB Atlas
* Email → Resend or SendGrid

---

# 🔐 Security & Authentication

## Implemented

### Authentication

* User registration
* User login
* JWT authentication
* Protected API routes
* Persistent login
* Automatic unauthorized-session handling
* Axios token injection

### Security

* bcrypt password hashing
* Authorization middleware
* Role-protected endpoints
* Secure invitation tokens
* Helmet
* API rate limiting
* Centralized error handling
* Organization-level data isolation

## Planned

* Refresh token architecture
* Password recovery
* Additional security hardening

---

# 🏢 Multi-Tenant Architecture

## Implemented

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

* Organization-level authorization
* Resource ownership enforcement
* Multi-tenant data isolation

# 🛡 Role-Based Access Control (RBAC)

## Implemented

### User Roles

* Owner
* Admin
* Member

### Backend Authorization

* Authorization middleware
* Role-protected endpoints
* Owner-only management actions
* Organization-level permission enforcement

### Frontend Controls

* Role-aware UI rendering
* Permission-based actions
* Restricted management controls

### Organization Administration

* Change user roles
* Remove users
* Manage invitation permissions

---

# 👥 Team Onboarding & Organization Management

## Implemented

### Member Management

* Organization Members page
* User listing
* Role display and editing
* User removal workflow

### Invitation System

* Invitation model
* Invitation API
* Secure invitation token generation
* Token validation
* Pending invitation tracking
* Invitation status management
* Invitation revocation

### Invitation Workflow

* Create invitations
* Generate secure tokens
* Email delivery
* Validate invitations
* Detect invitations during registration
* Pre-fill invited email
* Prevent invited email modification
* Automatically assign organization membership
* Assign default member roles
* Track invitation acceptance

### Email Delivery

* Nodemailer integration
* Gmail SMTP configuration
* HTML invitation emails
* Invitation acceptance links

---

# 📋 Project Management Features

## Boards

Implemented:

* Create boards
* View boards
* Update boards
* Delete boards
* Active board switching
* Organization-scoped board access

## Tasks

Implemented:

* Create, edit, and delete tasks
* Task status management
* Board filtering
* Task assignment
* Task creator tracking
* Task Details Modal
* Task activity timeline
* Comments
* Priority levels
* Due dates
* Search
* Filtering
* Sorting
* Optimistic UI updates

---

# 🖱 Kanban Workflow System

Implemented using `@dnd-kit`

Features:

* Drag-and-drop task management
* Todo column
* In Progress column
* Done column
* Drag overlay previews
* Backend synchronization
* Optimistic UI updates

---

# 📜 Audit Logging

## Implemented

### Audit System

* Audit log model
* Audit log API
* Audit log frontend interface
* Filtering
* User population
* Task activity history endpoint
* Organization Activity Feed integration

### Tracked Events

#### Boards

* `CREATE_BOARD`
* `UPDATE_BOARD`
* `DELETE_BOARD`

#### Tasks

* `CREATE_TASK`
* `UPDATE_TASK`
* `DELETE_TASK`
* `ASSIGN_TASK`

#### Comments

* `CREATE_COMMENT`
* `UPDATE_COMMENT`
* `DELETE_COMMENT`

#### Organization

* `CREATE_INVITATION`
* `ACCEPT_INVITATION`
* `UPDATE_USER_ROLE`
* `REMOVE_USER`

## Future Improvements

* Expand audit coverage to additional administrative events
* Add more detailed event metadata

# 🔔 Notifications

## Implemented

### Notification System

* Notification model
* Notification API
* Notification Bell UI
* Persistent notifications
* Unread counts
* Mark notifications as read
* Click notification → open related task

### Notification Types

* `TASK_ASSIGNED`
* `TASK_COMMENT`

---

# 💬 Collaboration Features

## Implemented

### Comments

* Create comments
* Edit comments
* Delete comments
* User attribution
* Comment history
* Comment notifications

### Activity Systems

* Organization Activity Feed
* Human-readable activity messages
* Assignment tracking
* Comment tracking
* Task Activity Timeline
* Task-specific audit history
* Activity icons
* User attribution

---

# 📊 Dashboard Metrics

## Implemented

### Metrics Endpoint

Provides:

* User count
* Board count
* Task count
* Todo count
* In Progress count
* Completed count

### Dashboard UI

Displays metric cards for:

* Users
* Boards
* Tasks
* Todo
* In Progress
* Completed

---

# ⚡ API Architecture

## Implemented

### Axios Infrastructure

* Centralized API client
* JWT token injection
* Global authentication handling
* Consistent API communication

### API Modules

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

Implemented:

* Registration
* Login
* JWT authentication
* Protected routes
* Axios interceptors
* Persistent sessions

---

## Phase 2 — Boards & Tasks ✅ Complete

Implemented:

* Board CRUD
* Task CRUD
* Board-task relationships
* Active board management

---

## Phase 3 — Kanban Workflow ✅ Complete

Implemented:

* Drag-and-drop task movement
* Workflow columns
* Status synchronization
* Optimistic updates

---

## Phase 4 — Organization Management ✅ Complete

Implemented:

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

## Phase 5 — Real-Time Collaboration 🔄 In Progress

- Pusher integration
- Task synchronization
- Real-time task updates
- Real-time activity feed updates
- Multi-tab synchronization

Known limitation:
- Dashboard activity feed may require refresh after repeated edits to the same task from another session.

## Phase 5 — Collaboration Systems ✅ Complete

Implemented:

* Comments system
* Notifications
* Organization Activity Feed
* Task assignment tracking
* Task Activity Timeline
* Audit-driven collaboration history

---

## Phase 6 — Production Readiness ⏳ Planned

- Automated testing
- Deployment
- CI/CD
- Final security review
- Portfolio polish


## Phase 6 — Dashboard & Analytics ✅ Complete

Implemented:

* Organization metrics
* User counts
* Board counts
* Task counts
* Workflow status metrics
* Dashboard metric cards

---

## Phase 7 — Invitation System ✅ Complete

Implemented:

* Invitation workflow
* Secure invitation tokens
* Invitation validation
* Invitation acceptance
* Organization assignment
* Email delivery
* Invitation tracking

Future improvements:

* Invitation expiration enforcement
* Improved email templates
* Email branding

---

## Phase 8 — Advanced Task Management ✅ Complete

Implemented:

* Task priorities
* Due dates
* Search
* Filtering
* Sorting
* Task assignment
* Comments
* Activity tracking

Future improvements:

* Advanced filtering options
* Additional task organization features

---

## Phase 9 — Real-Time Collaboration 🔄 In Progress

Current focus:

* Pusher real-time integration
* Multi-tab synchronization
* Real-time task updates
* Real-time assignment updates
* Real-time Activity Feed updates

Current blocker:

* Task updates synchronize correctly across tabs.
* Backend broadcasting and Pusher delivery are working.
* Remaining work is ensuring the Organization Activity Feed refreshes correctly on all connected clients after assignment changes.

---

## Phase 10 — Production Readiness ⏳ Planned

### Deployment

* Render backend deployment
* Vercel frontend deployment
* Production environment configuration

### Security

* Refresh token architecture
* Additional validation improvements
* Security hardening

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
* Real-time collaboration
* React application architecture
* REST API design
* MongoDB data modeling
* Secure backend development
* Production-oriented engineering practices

---

# 👨‍💻 Author

David Neagoy

GitHub:

https://github.com/DavidN-code
