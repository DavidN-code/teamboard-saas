# 🚀 TeamBoard – Multi-Tenant Project Management SaaS

TeamBoard is a full-stack SaaS application built to demonstrate production-style software engineering practices including secure authentication, multi-tenant architecture, role-based access control (RBAC), audit logging, team onboarding workflows, notifications, comments, activity tracking, and Kanban project management.

The project is being developed as a portfolio-quality application that showcases the skills commonly expected of modern full-stack software developers.

Current development focus is on building a realistic multi-tenant collaboration platform similar to Asana, Jira, ClickUp, Trello, and Monday.com.

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
* Notification systems
* Activity tracking systems
* Collaboration features
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
* Axios token injection
* Global authentication state

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

This prevents cross-organization data access and mirrors the architecture commonly used by SaaS platforms such as Slack, Asana, Notion, and ClickUp.

## Implemented

* Organization model
* Organization ownership
* User-to-organization relationships
* Organization-scoped boards
* Organization-scoped tasks
* Organization-scoped comments
* Organization-scoped notifications
* Organization-scoped audit logs
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
* Access audit logs

### Admin

* Manage project resources
* Create invitations
* Limited organization management
* Access audit logs

### Member

* Standard workspace access
* Task collaboration
* Commenting
* Notification access

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
* Task Details Modal
* Task creator tracking
* Task assignment system
* Task activity history
* Task comments
* Notification integration

### Task Details Modal

Implemented features:

* Edit task title
* Edit task description
* Edit task status
* Assign users
* Delete task
* View creator
* View assignee
* View comments
* Create comments
* Edit comments
* Delete comments
* View task activity timeline

---

# 👤 Task Assignment System

## Implemented

* Assign tasks to organization members
* Reassign tasks
* Unassign tasks
* Assignment dropdown UI
* Assignment notifications
* Assignment audit logging
* Assignment activity tracking

### Assignment Audit Events

* ASSIGN_TASK

### Assignment Notifications

When a task is assigned:

1. Notification created
2. Notification appears in Notification Bell
3. User receives unread count update
4. User can click notification
5. Task opens directly from notification

---

# 💬 Comments System

## Implemented

* Create comments
* Edit comments
* Delete comments
* Comment history
* User attribution
* Task-specific comment threads
* Comment notifications
* Comment audit logging

### Comment Audit Events

* CREATE_COMMENT
* UPDATE_COMMENT
* DELETE_COMMENT

### Comment Notifications

Task owners receive notifications when another user comments on their task.

---

# 🔔 Notification System

## Implemented

* Notification model
* Notification API
* Notification Bell UI
* Unread notification count
* Mark notification as read
* Clickable notifications
* Task navigation from notifications

### Notification Types

* TASK_ASSIGNED
* TASK_COMMENT

### Notification Features

* Unread badge count
* Read/unread state
* Notification history
* Direct task opening
* Notification persistence

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
* Organization scoping
* Task-specific history endpoint

### Tracked Actions

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

#### Organization Events

* CREATE_INVITATION
* ACCEPT_INVITATION
* UPDATE_USER_ROLE
* REMOVE_USER

---

# 📈 Activity Feed System

## Implemented

Organization-wide activity feed.

### Features

* User attribution
* Human-readable actions
* Task names
* Comment previews
* Assignment details
* Activity timestamps

Example:

Recovered Owner assigned task "Task Seven" to New Invite User

---

# 📊 Task Activity Timeline

Each task contains its own activity history.

## Implemented

### Timeline Events

* Task creation
* Task updates
* Task assignment
* Comment creation
* Comment updates
* Comment deletion
* Task deletion

### Timeline Features

* Reverse chronological ordering
* User attribution
* Activity icons
* Comment previews
* Assignment details

### Icons

* 📝 Create Task
* 👤 Assign Task
* ✏️ Update Task
* 💬 Create Comment
* 🛠️ Update Comment
* ❌ Delete Comment
* 🗑️ Delete Task

---

# 📊 Dashboard Metrics

## Implemented

### Metrics Endpoint

GET /api/metrics/dashboard

### Metrics Returned

* User count
* Board count
* Total task count
* Todo task count
* In Progress task count
* Completed task count

### Dashboard Cards

* Users
* Boards
* Tasks
* Todo
* In Progress
* Done

Example Response:

{
users: 2,
boards: 2,
tasks: 9,
todo: 7,
inProgress: 1,
done: 1
}

---

# ⚡ API Architecture

## Centralized Axios Client

* Shared API client
* Automatic JWT injection
* Authentication handling
* Consistent request patterns
* Global 401 handling

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

### Comments

* GET /api/comments/task/:taskId
* POST /api/comments
* PUT /api/comments/:id
* DELETE /api/comments/:id

### Notifications

* GET /api/notifications
* PUT /api/notifications/:id/read

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
* GET /api/audit-logs/task/:taskId

### Metrics

* GET /api/metrics/dashboard

---

# 🚧 Current Development Roadmap

## Recently Completed

### Collaboration Features

* Comments system
* Notifications system
* Activity feed
* Task assignment workflow
* Task activity timeline

### Analytics

* Dashboard metrics endpoint
* Dashboard metrics cards

### Audit Logging

* Assignment tracking
* Comment tracking
* Task activity history

---

## Next Milestone

### Dashboard Enhancements

* Auto-refresh dashboard metrics
* Improved metrics card styling
* Activity summaries
* Team insights

### Invitation System Enhancements

* Invitation expiration
* Resend invitation functionality
* Enhanced email templates

### Task Management Enhancements

* Task priorities
* Due dates
* Search and filtering

### Production Readiness

* Automated testing
* Validation layer
* Rate limiting
* Helmet security headers
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
* Activity tracking
* Notification systems
* Collaboration workflows
* Optimistic UI updates
* Drag-and-drop interfaces
* Environment-based configuration
* Organization onboarding workflows

---

# 👨‍💻 Author

David Neagoy

GitHub:
https://github.com/DavidN-code
