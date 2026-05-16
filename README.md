# Project Management App

A production-ready MERN stack project management web app with JWT authentication, role-based access control, project management, task assignment, dashboards, and overdue tracking.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Context API
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Architecture: MVC backend, REST APIs, centralized error handling, validation middleware

## Folder Structure

```txt
project-management-app/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    server.js
  frontend/
    src/
      components/
      context/
      pages/
      services/
      utils/
```

## Installation

```bash
cd project-management-app
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` with your MongoDB connection string, JWT secret, and optional admin bootstrap details.

## Admin Bootstrap

Public signup creates `member` users only. To create or promote an admin automatically on backend startup, add these variables to `backend/.env` or the Railway backend service:

```env
ADMIN_NAME=Project Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
ADMIN_RESET_PASSWORD=false
```

If `ADMIN_EMAIL` already exists, the backend promotes that user to `admin` and updates the name. Set `ADMIN_RESET_PASSWORD=true` only when you intentionally want to replace that user's password from the env value.

## Development

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Production Build

```bash
npm run build
npm start
```

## Railway Deployment

Deploy `backend` and `frontend` as separate Railway services.

Backend service:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Required variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`
- Optional admin bootstrap variables: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_RESET_PASSWORD`

Frontend service:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Required variables: `VITE_API_URL`

## Default Roles

Users who sign up through the public form are created as `member`. Use the admin bootstrap environment variables or update a user role directly in MongoDB to create an admin.

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/dashboard/stats`
