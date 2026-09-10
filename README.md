# TeamBoard

**A full-stack, multi-tenant project management SaaS application built with React, Node.js, Express, MongoDB, and real-time collaboration.**

TeamBoard is a production-style project management platform where organizations can manage boards, tasks, members, comments, notifications, and activity in a secure shared workspace.

The project was built to demonstrate full-stack software engineering beyond basic CRUD, with particular emphasis on **multi-tenant data isolation, role-based authorization, real-time collaboration, backend security, automated testing, and CI**.

> **Live Demo:** [Open TeamBoard](YOUR_FRONTEND_URL)

---

## Screenshots

<!-- Replace these with actual screenshots -->
<!--
![TeamBoard Dashboard](docs/images/dashboard.png)
![Task Details](docs/images/task-details.png)
![Members](docs/images/members.png)
-->

---

## Key Features

### Project Management

- Kanban boards with Todo, In Progress, and Done columns
- Drag-and-drop task management
- Task creation, editing, deletion, and assignment
- Priorities and due dates
- Task search, filtering, and sorting
- Personal **My Tasks** view
- Dashboard metrics

### Collaboration

- Task-specific comment threads
- Real-time task synchronization
- Real-time comments and activity updates
- Assignment and comment notifications
- Organization-wide activity feed
- Per-task activity timeline
- Multi-tab and multi-client synchronization

### Organizations & Access Control

- Organization-based multi-tenancy
- Owner, Admin, and Member roles
- Server-enforced Role-Based Access Control (RBAC)
- Organization member management
- Secure invitation-based onboarding
- Email invitation workflow
- Role-aware frontend controls

### Audit & Accountability

TeamBoard records important workspace activity including:

- Board creation, updates, and deletion
- Task creation, updates, assignment, and deletion
- Comment creation, editing, and deletion
- Invitations
- User role changes
- Member removal

Audit records include user attribution and timestamps and are surfaced through both organization-level and task-level activity views.

---

## Engineering Highlights

### Multi-Tenant Data Isolation

TeamBoard uses organization-based tenancy. Application resources are scoped to an `organizationId`, and authorization is enforced by the backend rather than relying on frontend visibility.

Cross-organization access controls cover resources including:

- Users
- Boards
- Tasks
- Comments
- Audit logs
- Invitations

Automated security tests verify that users from one organization cannot read, modify, delete, assign, or otherwise access protected resources belonging to another organization.

### Role-Based Authorization

TeamBoard implements three roles:

| Role | Access |
| --- | --- |
| **Owner** | Full workspace access, member/role management, board management, invitations, and audit logs |
| **Admin** | Project management, member access, invitations, and audit logs |
| **Member** | Dashboard, assigned tasks, task collaboration, comments, and notifications |

Authorization is enforced server-side with authentication and role middleware.

The backend reloads the authenticated user's current authorization state from the database, preventing an old JWT from preserving permissions after a user's role has been changed.

### Secure Real-Time Collaboration

Real-time functionality is implemented with Pusher.

TeamBoard uses authenticated private channels for:

- Organizations
- Boards
- Tasks
- Individual users

Channel authorization verifies organization membership and resource ownership before allowing subscriptions, preventing users from subscribing to another organization's real-time events.

Real-time events synchronize task changes, comments, activity, notifications, and other workspace updates across active clients.

### API Security & Validation

Backend protections include:

- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Tenant-scoped database queries
- Request validation with `express-validator`
- MongoDB ObjectId validation
- Helmet security headers
- Rate limiting
- Centralized error handling
- Restricted update fields
- Server-side resource ownership validation

---

## Automated Testing

The backend includes **32 automated integration and security regression tests** using:

- Jest
- Supertest
- `mongodb-memory-server`

The suite verifies critical behavior including:

- Registration and login
- Protected-route authentication
- Role-based authorization
- Current-role enforcement after role changes
- Cross-organization user isolation
- Board tenant isolation
- Task tenant isolation
- Assignment restrictions
- Comment tenant isolation
- Audit-log and activity isolation
- Request and ObjectId validation

```bash
npm test
```

Current test status:

```text
Test Suites: 4 passed, 4 total
Tests:       32 passed, 32 total
```

### Continuous Integration

GitHub Actions automatically installs the backend dependencies and runs the complete test suite on pushes and pull requests.

This provides regression protection for TeamBoard's authentication, authorization, validation, and tenant-isolation rules.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- dnd-kit
- Pusher JS

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- express-validator
- Helmet
- express-rate-limit
- Pusher
- Resend

### Testing & Infrastructure

- Jest
- Supertest
- mongodb-memory-server
- GitHub Actions
- MongoDB Atlas

---

## Architecture

```text
React / Vite Frontend
        |
        | REST API + JWT
        v
Node.js / Express API
        |
        +---- Authentication & RBAC
        |
        +---- Tenant-scoped controllers
        |
        +---- Request validation
        |
        +---- Pusher authorization
        |
        v
MongoDB Atlas

        +
        |
        v

Pusher Private Channels
        |
        v
Real-Time React Clients
```

Core data models include:

```text
Organization
    |
    +-- Users
    +-- Boards
    |     |
    |     +-- Tasks
    |           |
    |           +-- Comments
    |
    +-- Invitations
    +-- Notifications
    +-- Audit Logs
```

---

## Core API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Boards & Tasks

```text
GET    /api/tasks/board/:boardId
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Comments

```text
GET    /api/comments/task/:taskId
POST   /api/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
```

### Users & Audit Logs

```text
GET    /api/users
PUT    /api/users/:id/role
DELETE /api/users/:id

GET    /api/audit-logs
GET    /api/audit-logs/task/:taskId
```

---

## Running Locally

### Prerequisites

- Node.js
- npm
- MongoDB database

### Clone the repository

```bash
git clone https://github.com/DavidN-code/teamboard-saas.git
cd teamboard-saas
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Install frontend dependencies

```bash
cd ../frontend
npm install
```

### Environment Variables

Create the required environment configuration for the backend.

TeamBoard uses environment variables for services such as:

```text
MONGO_URI
JWT_SECRET
FRONTEND_URL
RESEND_API_KEY
PUSHER_APP_ID
PUSHER_KEY
PUSHER_SECRET
PUSHER_CLUSTER
```

Do not commit `.env` files or credentials to source control.

### Start the backend

```bash
cd backend
npm run dev
```

### Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

---

## Project Status

TeamBoard's core application is feature-complete and deployed.

Completed areas include:

- Authentication and onboarding
- Multi-tenant resource isolation
- Role-based authorization
- Boards and Kanban task management
- Task assignment
- Comments
- Notifications
- Invitations
- Member management
- Audit logging
- Activity feeds
- Dashboard metrics
- Search and filtering
- Real-time collaboration
- Responsive desktop/mobile UI
- Backend security hardening
- Automated integration/security testing
- Continuous Integration with GitHub Actions

---

## What This Project Demonstrates

TeamBoard was built as a flagship full-stack portfolio project and demonstrates experience with:

- Designing a multi-tenant SaaS architecture
- Building REST APIs with Node.js and Express
- Modeling application data with MongoDB and Mongoose
- Building responsive React interfaces
- Implementing authentication and server-side authorization
- Enforcing tenant boundaries across application resources
- Securing real-time communication
- Designing role-based product behavior
- Building collaborative real-time features
- Writing integration and security regression tests
- Configuring continuous integration
- Debugging behavior across multiple clients and application layers

---

## Author

**David Neagoy**

GitHub: [DavidN-code](https://github.com/DavidN-code)