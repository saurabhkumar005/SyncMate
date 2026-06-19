# 🚀 SyncMate

SyncMate is a full-stack real-time chat platform designed for seamless communication and collaboration. It provides secure authentication, persistent messaging, and live updates using Socket.IO, along with a containerized and CI-enabled deployment workflow.

## 🌐 Live Demo

* **Frontend:** https://syncmate-phi.vercel.app
* **Backend API:** https://syncmate-backend-pc2z.onrender.com

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Password hashing and secure API access

### 💬 Real-Time Chat

* One-to-one conversations
* Persistent message storage
* Socket.IO based live messaging
* Automatic room joining after authentication
* Online user tracking

### 🗄 Database

* MySQL relational database
* Optimized schema with foreign key relationships
* Connection pooling using mysql2
* Persistent chat history

### ⚡ Backend Architecture

* Layered architecture
* Repository-Service-Controller pattern
* Modular structure
* REST APIs
* Error handling middleware

### 🎨 Frontend

* React + Vite
* Tailwind CSS
* Responsive UI
* SPA routing

### 🐳 Containerization

* Dockerized frontend and backend
* Multi-container setup using Docker Compose
* Nginx-based frontend serving
* Separate Dockerfiles for frontend and backend

### ⚙ CI/CD

* GitHub Actions workflow
* Automatic Docker image build
* DockerHub image publishing
* Versioned image tags using commit SHA
* Latest image tag support

### ☁ Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* MySQL hosted on Aiven Cloud

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js
* Socket.IO
* JWT

## Database

* MySQL

## DevOps

* Docker
* Docker Compose
* GitHub Actions
* DockerHub
* Render
* Vercel
* Aiven

---

# 📂 Project Structure

```
SyncMate
│
├── Frontend
│   ├── src
│   ├── public
│   ├── Dockerfile
│
├── Backend
│   ├── src
│   │   ├── config
│   │   ├── middlewares
│   │   ├── modules
│   │   │   ├── auth
│   │   │   └── chat
│   │   ├── socket
│   │   └── utils
│   │
│   ├── database
│   ├── Dockerfile
│
├── .github
│   └── workflows
│       └── ci.yml
│
├── docker-compose.yml
└── Jenkinsfile
```

---

# 🐳 Running Locally

## Clone Repository

```bash
git clone https://github.com/saurabhkumar005/SyncMate.git
cd SyncMate
```

## Start Using Docker Compose

```bash
docker compose up --build
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:8080
```

---

# ⚙ CI Pipeline

The project uses GitHub Actions for Continuous Integration:

1. Checkout repository
2. Setup Docker Buildx
3. Login to DockerHub
4. Build frontend image
5. Build backend image
6. Push images to DockerHub
7. Maintain latest and commit-specific tags

---

# 📸 Screenshots

(Add screenshots here)

---

# 👨‍💻 Author

**Saurabh Kumar**

* GitHub: https://github.com/saurabhkumar005
* LinkedIn: https://linkedin.com/in/saurabhkumar005/

---

⭐ If you found this project useful, consider giving it a star.
