# 🚀 TeamBoard – Multi-Tenant Project Management SaaS

TeamBoard is a full-stack SaaS project management application being built as a portfolio-quality project to demonstrate modern full-stack software engineering skills.

The goal is to create a realistic multi-tenant collaboration platform similar to Asana, Jira, ClickUp, Trello, and Monday.com.

The primary purpose of this project is to demonstrate skills needed for a software developer role:

- Full-stack application development
- SaaS architecture
- Authentication and security
- Multi-tenant systems
- RBAC permissions
- REST APIs
- React frontend architecture
- MongoDB data modeling
- Collaboration workflows
- Production-style engineering practices


# 🧱 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcrypt password hashing
- Nodemailer email integration


## Frontend

- React
- Vite
- React Router
- Axios
- @dnd-kit/core
- @dnd-kit/sortable


# 🏢 Multi-Tenant Architecture

TeamBoard uses organization-based tenancy.

Users belong to organizations, and resources are scoped by organizationId to prevent cross-organization data access.

Implemented:

- Organization model
- User organizations
- Organization-scoped boards
- Organization-scoped tasks
- Organization-scoped comments
- Organization-scoped notifications
- Organization-scoped audit logs
- Organization member management


# 🔐 Authentication & Security

Implemented:

- User registration
- Login
- JWT authentication
- bcrypt password hashing
- Protected backend routes
- Auth middleware
- Axios JWT token injection
- Persistent frontend login
- Automatic logout on 401 responses
- Centralized error handling


# 🛡 Role-Based Access Control (RBAC)

Roles:

## Owner

- Full organization access
- Manage members
- Change roles
- Create invitations
- View audit logs


## Admin

- Manage project resources
- Invite users
- Limited organization management


## Member

- Workspace access
- Task collaboration
- Commenting
- Notifications


Implemented:

- User roles
- Backend authorization checks
- Role-based routes
- Member management UI
- Role updates
- User removal workflow


# 👥 Organization Invitations

Implemented:

- Invitation creation
- Secure invitation tokens
- Invitation validation
- Email invitations
- Invitation registration flow
- Automatic organization joining
- Pending/accepted invitation tracking


# 📧 Email Integration

Implemented:

- Nodemailer
- Gmail SMTP configuration
- HTML invitation emails
- Invitation acceptance links


# 📋 Boards & Tasks

## Boards

Implemented:

- Create boards
- Update boards
- Delete boards
- View boards
- Active board switching


## Tasks

Implemented:

- Create tasks
- Edit tasks
- Delete tasks
- Task status management
- Task priority support
- Due date support
- Task assignment
- Task creator attribution (`createdBy`)
- Task Details Modal
- Task comments
- Task activity timeline


# 👤 Task Assignment System

Implemented:

- Assign tasks to organization members
- Reassign tasks
- Unassign tasks
- Assignment dropdown
- Assignment notifications
- Assignment audit logging


Assignment event:

- ASSIGN_TASK


# 💬 Comments System

Comments were already partially implemented and were recently connected/refined in the frontend.

Implemented:

Backend:

- Comment model
- Comment controller
- Comment routes
- Organization-scoped comments
- User attribution
- Comment permissions


Frontend:

Location:

frontend/src/components/comments/

Files:

- CommentForm.jsx
- CommentList.jsx
- CommentItem.jsx


Features:

- Create comments
- Edit comments
- Delete comments
- Display commenter
- Display timestamps
- Task-specific comment threads


Comment audit events:

- CREATE_COMMENT
- UPDATE_COMMENT
- DELETE_COMMENT


Comment notifications:

Task creators receive notifications when another user comments on their task.


Important behavior:

- Adding/editing/deleting comments immediately updates the task activity timeline.
- The organization-wide dashboard activity feed may still require a page refresh to display new comment activity.


# 🔔 Notification System

Implemented:

- Notification model
- Notification API
- Notification bell
- Unread count
- Mark notifications as read
- Click notification → open task


Notification types:

- TASK_ASSIGNED
- TASK_COMMENT


# 🖱 Kanban Board

Implemented using @dnd-kit.

Features:

- Todo column
- In Progress column
- Done column
- Drag and drop
- Backend synchronization
- Optimistic updates


# 📜 Audit Logging System

Implemented:

- Audit log model
- Audit log API
- Audit log dashboard
- User attribution
- Organization scoping
- Task-specific audit history endpoint


Tracked events:


Boards:

- CREATE_BOARD
- UPDATE_BOARD
- DELETE_BOARD


Tasks:

- CREATE_TASK
- UPDATE_TASK
- DELETE_TASK
- ASSIGN_TASK


Comments:

- CREATE_COMMENT
- UPDATE_COMMENT
- DELETE_COMMENT


Organization:

- CREATE_INVITATION
- ACCEPT_INVITATION
- UPDATE_USER_ROLE
- REMOVE_USER


# 📈 Activity Systems

TeamBoard has two activity views.


## Organization Activity Feed

Workspace-wide activity feed showing:

- Task creation
- Task updates
- Assignments
- Comments
- User actions


## Task Activity Timeline

Each task has its own history.

The timeline uses audit log data filtered by task.

Displays:

- Task creation
- Task updates
- Task assignments
- Comment creation
- Comment edits
- Comment deletion
- Task deletion

Includes:

- User names
- Timestamps
- Icons
- Human-readable descriptions


# 📊 Dashboard Metrics

Implemented:

Endpoint:

GET /api/metrics/dashboard


Returns:

- User count
- Board count
- Task count
- Todo count
- In Progress count
- Completed count


Dashboard displays metric cards.


# 📌 My Tasks Page

Recently implemented.

Purpose:

Show tasks assigned to the currently logged-in user.

Implemented:

- Dedicated My Tasks page
- Fetches assigned tasks
- Displays user-specific task list
- Uses existing task assignment system


# 🔎 Task Search / Sorting

Already implemented on dashboard.

Current functionality includes:

- Task searching
- Task sorting/filtering

Avoid duplicating this work when adding future features.


# ⚡ API Structure

Important routes:


Authentication:

POST /api/auth/register

POST /api/auth/login


Tasks:

GET /api/tasks/board/:boardId

POST /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id


Comments:

GET /api/comments/task/:taskId

POST /api/comments

PUT /api/comments/:id

DELETE /api/comments/:id


Notifications:

GET /api/notifications

PUT /api/notifications/:id/read


Users:

GET /api/users

PUT /api/users/:id/role

DELETE /api/users/:id


Audit:

GET /api/audit-logs

GET /api/audit-logs/task/:taskId


Metrics:

GET /api/metrics/dashboard


# 📁 Important Frontend Files


Task Details:

frontend/src/components/tasks/TaskDetailsModal.jsx


Handles:

- Editing tasks
- Assigning users
- Comments
- Activity timeline


Comments:

frontend/src/components/comments/

Contains:

- CommentForm.jsx
- CommentList.jsx
- CommentItem.jsx


Comments API:

frontend/src/api/comments.js


# 📍 Current Development State

Completed:

✅ Authentication  
✅ Multi-tenancy  
✅ RBAC  
✅ Invitations  
✅ Email workflow  
✅ Boards  
✅ Tasks  
✅ Kanban  
✅ Task assignment  
✅ Notifications  
✅ Audit logging  
✅ Organization activity feed  
✅ Task activity timeline  
✅ Comments system  
✅ My Tasks page  
✅ Task search/sorting  


# 🚧 Current Next Steps

Potential next features:


## Task Creation Improvements

Current limitation:

- Tasks can be assigned after creation
- Create Task modal does not yet include assignment selection


Possible improvement:

- Add organization member assignment dropdown directly to TaskModal.jsx


## Dashboard Improvements

Possible improvements:

- Auto-refresh dashboard activity
- Better metrics styling
- Team insights


## Production Readiness

Future:

- Automated testing
- Validation layer
- Refresh token system
- Rate limiting
- Helmet security headers
- Deployment


# 📝 Last Development Work

Recent work focused on:

- My Tasks page implementation
- Comment system refinement
- TaskDetailsModal updates
- Immediate task activity refresh after comment changes

Current modified areas:

- frontend/src/components/tasks/TaskDetailsModal.jsx
- roadmap.md


# 👨‍💻 Project Goal

Finish TeamBoard as a strong portfolio project demonstrating the ability to build a production-style SaaS application.

After completion:

- Polish README for employers
- Deploy application
- Prepare GitHub repository
- Use project as a software developer portfolio piece