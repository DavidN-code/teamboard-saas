# 🚀 TeamBoard – Multi-Tenant Project Management SaaS

TeamBoard is a full-stack SaaS project management application being built as a portfolio-quality project to demonstrate modern software engineering practices.

The application is inspired by platforms such as Asana, Jira, ClickUp, Trello, and Monday.com, with a strong emphasis on multi-tenant architecture, security, collaboration, and production-ready design.

Primary goals:

* Full-stack application development
* SaaS architecture
* Authentication and security
* Multi-tenant systems
* Role-Based Access Control (RBAC)
* REST API development
* React frontend architecture
* MongoDB data modeling
* Real-time collaboration
* Production-style engineering practices

# 🧱 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt password hashing
* Nodemailer
* Pusher (real-time events)

## Frontend

* React
* Vite
* React Router
* Axios
* @dnd-kit/core
* @dnd-kit/sortable
* Pusher JS

# 🏢 Multi-Tenant Architecture

TeamBoard uses organization-based tenancy.

Every resource is scoped by `organizationId`, ensuring complete data isolation between organizations.

Implemented:

* Organizations
* Organization-scoped users
* Boards
* Tasks
* Comments
* Notifications
* Audit logs
* Organization member management

# 🔐 Authentication & Security

Implemented:

* User registration
* Login
* JWT authentication
* bcrypt password hashing
* Protected backend routes
* Authentication middleware
* Axios JWT token injection
* Persistent frontend login
* Automatic logout on expired tokens (401 handling)
* Centralized error handling

# 🛡 Role-Based Access Control (RBAC)

### Owner

* Full organization access
* Manage members
* Change user roles
* Create invitations
* View audit logs

### Admin

* Manage project resources
* Invite users
* Limited organization management

### Member

* Workspace access
* Task collaboration
* Comments
* Notifications

Implemented:

* User roles
* Backend authorization checks
* Role-protected routes
* Member management UI
* Role updates
* User removal workflow

# 👥 Organization Invitations

Implemented:

* Invitation creation
* Secure invitation tokens
* Invitation validation
* Email invitations
* Invitation registration flow
* Automatic organization joining
* Pending / accepted invitation tracking

# 📧 Email Integration

Implemented:

* Nodemailer
* Gmail SMTP
* HTML invitation emails
* Invitation acceptance links

# 📋 Boards & Tasks

## Boards

Implemented:

* Create boards
* Update boards
* Delete boards
* View boards
* Active board switching

# 📋 Tasks

Implemented:

* Create, edit, and delete tasks
* Status management
* Priority levels
* Due dates
* Task assignment
* Task creator attribution (`createdBy`)
* Task Details Modal
* Comments
* Task activity timeline

# 👤 Task Assignment

Implemented:

* Assign tasks to organization members
* Reassign tasks
* Unassign tasks
* Assignment dropdown
* Assignment notifications
* Assignment audit logging

Audit Event:

* `ASSIGN_TASK`

# 💬 Comments System

Implemented:

### Backend

* Comment model
* Comment controller
* Comment API routes
* Organization-scoped comments
* User attribution
* Comment permissions

### Frontend

Location:

`frontend/src/components/comments/`

Components:

* CommentForm.jsx
* CommentList.jsx
* CommentItem.jsx

Features:

* Create comments
* Edit comments
* Delete comments
* Comment timestamps
* Task-specific discussion threads

Audit Events:

* `CREATE_COMMENT`
* `UPDATE_COMMENT`
* `DELETE_COMMENT`

Notifications:

* Task creators receive notifications when another user comments on their task.

# 🔔 Notification System

Implemented:

* Notification model
* Notification API
* Notification Bell UI
* Unread notification count
* Mark notifications as read
* Open related task directly from a notification

Notification Types:

* `TASK_ASSIGNED`
* `TASK_COMMENT`

# 🖱 Kanban Board

Implemented using **@dnd-kit**

Features:

* Todo
* In Progress
* Done
* Drag-and-drop
* Backend synchronization
* Optimistic UI updates

# 📜 Audit Logging

Implemented:

* Audit Log model
* Audit Log API
* Organization Activity Feed
* Task activity timeline
* Organization-scoped audit logs
* User attribution
* Task-specific audit history endpoint

Tracked Events:

### Boards

* `CREATE_BOARD`
* `UPDATE_BOARD`
* `DELETE_BOARD`

### Tasks

* `CREATE_TASK`
* `UPDATE_TASK`
* `DELETE_TASK`
* `ASSIGN_TASK`

### Comments

* `CREATE_COMMENT`
* `UPDATE_COMMENT`
* `DELETE_COMMENT`

### Organization

* `CREATE_INVITATION`
* `ACCEPT_INVITATION`
* `UPDATE_USER_ROLE`
* `REMOVE_USER`

# 📈 Activity System

TeamBoard includes two activity views.

## Organization Activity Feed

Displays organization-wide activity, including:

* Task creation
* Task updates
* Task assignments
* Comments
* Organization user actions

## Task Activity Timeline

Each task maintains its own audit history.

Displays:

* Task creation
* Task updates
* Task assignments
* Comment creation
* Comment edits
* Comment deletion
* Task deletion

Includes:

* User attribution
* Timestamps
* Icons
* Human-readable activity descriptions

# 📊 Dashboard Metrics

Implemented

Endpoint:

`GET /api/metrics/dashboard`

Returns:

* Total users
* Total boards
* Total tasks
* Todo tasks
* In Progress tasks
* Completed tasks

Displayed as dashboard metric cards.

# 📌 My Tasks

Purpose:

Display tasks assigned to the currently logged-in user.

Implemented:

* Dedicated My Tasks page
* User-specific task list
* Built on the existing task assignment system

# 🔎 Task Search & Filtering

Dashboard supports:

* Task search
* Status filtering
* Priority filtering
* Sorting

# ⚡ API Overview

## Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

## Tasks

* `GET /api/tasks/board/:boardId`
* `POST /api/tasks`
* `PUT /api/tasks/:id`
* `DELETE /api/tasks/:id`

## Comments

* `GET /api/comments/task/:taskId`
* `POST /api/comments`
* `PUT /api/comments/:id`
* `DELETE /api/comments/:id`

## Notifications

* `GET /api/notifications`
* `PUT /api/notifications/:id/read`

## Users

* `GET /api/users`
* `PUT /api/users/:id/role`
* `DELETE /api/users/:id`

## Audit Logs

* `GET /api/audit-logs`
* `GET /api/audit-logs/task/:taskId`

## Metrics

* `GET /api/metrics/dashboard`

# 📁 Key Frontend Components

## Task Details

`frontend/src/components/tasks/TaskDetailsModal.jsx`

Responsibilities:

* Edit tasks
* Assign and unassign users
* Manage comments
* Display task activity timeline

## Comments

Location:

`frontend/src/components/comments/`

Components:

* CommentForm.jsx
* CommentList.jsx
* CommentItem.jsx

API:

`frontend/src/api/comments.js`

# 📍 Current Project Status

Completed

* ✅ Authentication
* ✅ Multi-tenancy
* ✅ RBAC
* ✅ Organization invitations
* ✅ Email workflow
* ✅ Boards
* ✅ Tasks
* ✅ Kanban board
* ✅ Task assignment
* ✅ Notifications
* ✅ Dashboard metrics
* ✅ Audit logging
* ✅ Organization Activity Feed
* ✅ Task Activity Timeline
* ✅ Comments system
* ✅ My Tasks page
* ✅ Task search, filtering, and sorting
* ✅ Organization member management
* ✅ Invitation-based onboarding
* ✅ Security middleware (Helmet, Rate Limiting, Validation)
* ✅ Role-based UI restrictions
the app has been deployed -frontend and backend

# 🚧 Current Focus

Current work is centered on improving real-time collaboration.

### Real-Time Synchronization

Implemented:

* Pusher integration
* Real-time task creation
* Real-time task updates
* Real-time task deletion
* Real-time assignment notifications
* Multi-tab synchronization

Current blocker:

* The Organization Activity Feed does not always refresh immediately across already-open browser tabs after task assignment/unassignment.  -this is what I'm currently focused on fixing.
* Backend broadcasting and Pusher delivery have been verified.

# 📝 Latest Development Work

Recent work includes:

* Real-time synchronization improvements
* Assignment / unassignment audit logging
* Activity Feed refinement
* Dashboard synchronization debugging
* Multi-tab collaboration improvements

# 👨‍💻 Project Goal

Complete TeamBoard as a production-quality SaaS portfolio application demonstrating:

* Modern full-stack architecture
* Secure multi-tenant design
* Real-time collaboration
* Clean engineering practices
* Production-ready code quality

After completion:

* Polish README for employers
* Publish the GitHub repository
* Use TeamBoard as a flagship software engineering portfolio project
