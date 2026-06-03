# TeamBoard – Secure Multi-Tenant SaaS Platform

## 🚀 Overview

TeamBoard is a production-style multi-tenant project management SaaS application designed to demonstrate modern full-stack development practices, secure authentication, role-based access control (RBAC), audit logging, and organization-scoped data management.

The goal of this project is to showcase real-world SaaS architecture and engineering patterns rather than simply implementing CRUD functionality.

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt

### Frontend

* React
* React Router
* Axios
* Vite
* @dnd-kit/core
* @dnd-kit/sortable

### Planned Deployment

* Backend → Render
* Frontend → Vercel
* Database → MongoDB Atlas

---

## 🔐 Security & Authentication

### Completed

* JWT authentication
* Password hashing with bcrypt
* Protected API routes
* Axios interceptor authentication flow
* Persistent login using localStorage
* Automatic unauthorized-session handling
* Centralized error handling

### Planned

* Refresh token authentication
* Rate limiting
* Helmet security headers
* Input validation (Zod/Joi)
* Account lockout protection

---

## 🏢 Multi-Tenant Architecture

### Completed

* Organization model
* User-to-organization relationships
* Organization ownership
* Organization-scoped data access
* Organization-scoped user management

### Goal

Ensure complete data isolation between organizations.

---

## 🛡 Role-Based Access Control (RBAC)

### Completed

* Owner role
* Admin role
* Member role
* Backend authorization middleware
* Role-restricted API endpoints

### In Progress

* Frontend role-aware UI controls
* Role management interface

---

## 📋 Core Features

### Boards

* Create boards
* View boards
* Board switching
* Organization-scoped access

### Tasks

* Create tasks
* Edit tasks
* Delete tasks
* Status tracking
* Board filtering
* Optimistic UI updates

### Kanban System

* Drag-and-drop workflow
* Todo / In Progress / Done columns
* Backend synchronization
* Drag preview overlay

---

## 📜 Audit Logging

### Completed

* Audit log model
* Audit log API
* Activity tracking
* Pagination
* Filtering
* User population
* Audit log frontend page

Tracked events:

* Board creation
* Board updates
* Board deletion
* Task creation
* Task updates
* Task deletion

---

## 👥 Organization Members

### Completed

* User management API
* Organization members endpoint
* Organization Members page
* Member listing table
* Name, email, and role display

### Next Steps

* Role editing UI
* Role badges
* Permission-based controls
* User removal workflow

---

# 🗺 Development Roadmap

## Phase 1 — Authentication & Foundations ✅

* Registration
* Login
* JWT authentication
* Protected routes
* Axios interceptors
* Persistent sessions

---

## Phase 2 — Boards & Tasks ✅

* Board CRUD
* Task CRUD
* Board/task relationships
* Active board state management

---

## Phase 3 — Kanban Workflow ✅

* Drag-and-drop system
* Workflow columns
* Optimistic UI updates
* Task status synchronization

---

## Phase 4 — Organization & Access Management 🚧 CURRENT PRIORITY

### Role Management

* Role badges
* Change user role
* Frontend role controls

### Permission Enforcement

* Owner-only actions
* Admin-only actions
* Hidden UI controls based on permissions

### User Management

* Remove users
* Permission validation
* Improved member administration

---

## Phase 5 — Dashboard & SaaS Experience

### Dashboard Enhancements

* Organization metrics
* User counts
* Board counts
* Task counts
* Recent activity widgets

### UX Improvements

* Loading states
* Empty states
* Responsive design
* UI polish

---

## Phase 6 — Team Collaboration

### Invitations

* Invite users by email
* Join organization workflow
* Team onboarding experience

---

## Phase 7 — Production Readiness

### Deployment

* Render backend deployment
* Vercel frontend deployment
* Environment configuration

### Security

* Refresh tokens
* Validation layer
* Rate limiting
* Helmet

### Testing

* Backend API testing
* Frontend component testing
* Integration testing

---

## 🎯 Portfolio Objectives

This project demonstrates:

* Full-stack application development
* JWT authentication
* Multi-tenant SaaS architecture
* Role-based access control
* Audit logging systems
* React state management
* REST API design
* MongoDB data modeling
* Secure backend architecture
* Modern frontend engineering practices

---

## 👨‍💻 Author

David Neagoy

GitHub:
https://github.com/DavidN-code
