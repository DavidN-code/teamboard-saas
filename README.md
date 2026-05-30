# 🚀 TeamBoard – Secure Multi-Tenant SaaS Platform (Full-Stack Kanban System)

TeamBoard is a production-style, full-stack SaaS application designed to demonstrate secure backend architecture, multi-tenant data isolation, role-based access control (RBAC), and real-time-like drag-and-drop task management.

This project simulates a modern Kanban-style SaaS product similar to Trello, with authentication, boards, tasks, and interactive drag-and-drop workflows.

---

## 🧠 Overview

TeamBoard allows users to:

- Create and manage boards (projects)
- Create, edit, delete, and organize tasks
- Drag and drop tasks between workflow columns
- Persist authentication using JWT
- Secure all API routes with middleware-based authentication

The goal is to demonstrate a **real-world SaaS architecture with interactive UI behavior and secure backend integration**, not just CRUD endpoints.

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

### Frontend
- React (Vite)
- React Router
- Axios (with interceptors)
- @dnd-kit/core
- @dnd-kit/sortable

### Deployment (planned)
- Backend → Render
- Frontend → Vercel
- Database → MongoDB Atlas

---

## 🔐 Core Features

### 🔑 Authentication & Security
- User registration and login using JWT
- Password hashing with bcrypt
- Protected API routes using middleware
- Persistent login using localStorage
- Axios interceptor automatically attaches JWT token
- Automatic redirect to login on 401 unauthorized responses

---

### 🛡 Role-Based Access Control (RBAC – foundation)
- Architecture supports roles (Owner, Admin, Member)
- Backend structure ready for permission expansion

---

### 🏢 Multi-Tenant Architecture (foundation)
- Boards scoped to active user context
- Backend designed for organization-level isolation (expandable)

---

### 📋 Boards & Tasks (Kanban System)

#### Boards
- Create boards dynamically
- Sidebar loads all boards for user
- Active board selection system
- Instant switching between boards

#### Tasks
- Full CRUD (Create, Read, Update, Delete)
- Status tracking:
  - todo
  - in-progress
  - done
- Board-based task filtering
- Real-time UI updates after API changes

---

### 🖱 Drag & Drop Kanban System (Major Feature)

- Built using @dnd-kit
- Drag tasks between columns:
  - Todo → In Progress → Done
- Column-based drop zones
- Drag preview overlay for UX clarity
- Optimistic UI updates before backend confirmation
- Backend sync via PUT /tasks/:id

---

### ⚡ Axios API Architecture

- Centralized API client (api/axios.js)
- JWT automatically injected into headers
- Global 401 interceptor:
  - Clears invalid token
  - Redirects user to login page
- Consistent API structure across frontend

---

### 📜 Task Interaction System

- Click task to open detail modal
- Edit title, description, and status
- Delete task with confirmation
- Modal updates sync across global state

---

## 📂 Project Structure

```
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
    assets/
    components/
      layout/
      tasks/
    context/
    pages/
    App.jsx
    main.jsx
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DavidN-code/teamboard-saas.git
cd teamboard-saas/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5050
```

### 4. Run backend

```bash
npm start
```

Server runs at:
```
http://localhost:5050
```

### 5. Run frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 API Endpoints

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
- GET /api/tasks/board/:boardId
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

---

### Audit Logs (Future Feature)
- GET /api/audit-logs (Owner/Admin only)

---

## 🧪 Key Engineering Patterns Demonstrated

- JWT authentication system
- Axios interceptor architecture
- Kanban drag-and-drop UI system
- Optimistic UI updates
- React Context API state management
- Component-based modal system
- Separation of API, UI, and state layers

---

## 🚧 Future Improvements

- Refine drag-and-drop UX polish
- Add WebSocket real-time collaboration
- Add refresh token authentication
- Add full RBAC enforcement
- Add audit log frontend UI
- Add backend validation layer (Zod/Joi)

---

## 👨‍💻 Author

David Neagoy  
https://github.com/DavidN-code