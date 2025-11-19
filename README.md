# Task Tracker App

A simple **Task Tracker** web application built with **React.js + TypeScript** for the frontend and **Node.js + Express + TypeScript** for the backend.  
Users can register, login, and manage their tasks (CRUD) with JWT-based authentication. All data is stored **in-memory** (no database required).

---

## Features

- **Authentication**
  - User registration (`/auth/register`)
  - User login (`/auth/login`) with JWT
- **Task Management (Protected)**
  - List tasks (`GET /tasks`)
  - Create task (`POST /tasks`)
  - Update task (`PUT /tasks/:id`)
  - Delete task (`DELETE /tasks/:id`)
  - Update task status (Pending / Completed)
- **Frontend**
  - React + TypeScript
  - Task dashboard with table view
  - Add / Edit task using modal
  - Logout button

## Setup & Installation

1. Clone the repository

bash
git clone repo
cd task-tracker-app

2. Install dependencies
npm install

# Server
cd ../server
npm install

# Client
cd ../client
npm install

3. Configure environment variables
Server (server/.env)
PORT=4000
JWT_SECRET=your_jwt_secret
Client (client/.env)
VITE_API_URL=http://localhost:4000

4. Running the app
npm start
