# TeamBoard SaaS

Backend-focused SaaS application for managing boards within organizations.
Built with Node.js, Express, and MongoDB to demonstrate authentication, authorization, and scalable backend architecture.

---

## 🚀 Overview

TeamBoard is a multi-tenant backend system where users belong to organizations and manage boards securely.

This project focuses on real-world backend concepts such as JWT authentication, role-based access, and clean API design.

---

## 🧱 Tech Stack

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt

---

## 🔑 Current Features

* User registration with organization creation
* Secure login with JWT authentication
* Password hashing using bcrypt
* Multi-tenant architecture (organization-based data isolation)
* Role-based access (owner role)
* Protected API routes
* Full CRUD operations for Boards
* Centralized error handling
* ObjectId validation for routes

---

## 📂 Project Structure

```
backend/
  src/
    controllers/
    middleware/
    models/
    routes/
  app.js
  server.js
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DavidN-code/teamboard-saas.git
cd teamboard-saas/backend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create environment variables

Create a `.env` file in the `backend/` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5050
```

---

### 4. Run the server

```bash
npm start
```

Server runs at:

```
http://localhost:5050
```

---

## 🔐 Authentication Example

### Login

```bash
curl -X POST http://localhost:5050/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "test1234"
}'
```

---

### Access Protected Route

```bash
curl http://localhost:5050/api/boards \
-H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📌 API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Boards (Protected)

* GET /api/boards
* POST /api/boards
* GET /api/boards/:id
* PUT /api/boards/:id
* DELETE /api/boards/:id

---

## 🧠 Future Improvements

See `ROADMAP.md` for planned features.

---

## 👨‍💻 Author

David Neagoy
https://github.com/DavidN-code
