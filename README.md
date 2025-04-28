# 🔠 Mini CRM - Project README

Welcome to **Mini CRM** — a lightweight Customer Relationship Management tool, designed for freelancers, small teams, and agencies to manage Clients, Projects, Reminders, and Interaction Logs efficiently.

---

## ✨ Overview

Mini CRM allows you to:
- Manage Clients (name, email, phone, company, notes)
- Manage Projects (linked to Clients)
- Track Reminders for tasks with due dates
- Log Interactions (calls, emails, meetings) related to clients or projects
- Visualize all activities through a clean Dashboard
- Securely authenticate users using Supabase

---

## 📖 Tech Stack for Frontend

| Area | Technology |
|:----|:-----------|
| Frontend | React.js, Vite, TypeScript |
| State Management | React Context API, React Query |
| UI Framework | Tailwind CSS, Shadcn UI |
| Authentication | Supabase Auth (JWT Tokens) |
| Form Handling | React Hook Form + Zod Validation |

---

## 📁 Frontend Folder Structure

```bash
/frontend
 ├── /src
 │    ├── /components        # Reusable UI Components (Sidebar, TopBar, Dialogs etc.)
 │    ├── /pages             # Pages (Dashboard, Clients, Projects, Reminders, Interactions)
 │    ├── /contexts          # ThemeContext, AuthContext
 │    ├── /hooks             # Custom React Hooks (use-mobile, use-toast)
 │    ├── /services          # API Clients using Axios
 │    ├── /lib               # Helpers (formatDate, formatters)
 │    ├── /types             # TypeScript interfaces (Client, Project, Reminder, InteractionLog, User)
 │    ├── App.tsx            # Main App Component
 │    ├── index.tsx          # React Root Entrypoint
 │    └── router.tsx         # React Router (Private Routes, Public Routes)
 ├── package.json
 ├── vite.config.ts
 └── .env
```

---

## ⚙️ Setup Instructions

1. Clone the Repository
```bash
git clone https://github.com/ronok420/mini-crm-for-freelancers.git
```

2. Move into the Frontend Directory
```bash
cd client
```

3. Install Dependencies
```bash
npm install
```

4. Run Development Server
```bash
npm run dev
```

---

## 📅 Authentication Headers

All protected routes require:

```http
Authorization: Bearer <your-access-token>
```

---

## 👤 Sample Test User

Signup using:
```json
{
  "email": "testuser2024@gmail.com",
  "password": "password123"
}
```

Or use Supabase Auth UI directly.

---

## 📖 Summary of Architecture & Key Decisions

- Supabase handles authentication and hosted PostgreSQL database.
- Prisma ORM ensures type-safe, efficient database operations.
- React Query handles API communication (caching, background sync).
- React Hook Form + Zod for dynamic form validation.
- Tailwind CSS + Shadcn for minimal, clean UI building blocks.
- Full TypeScript stack ensures reliability and scalability.
- Built-in Dark/Light Mode.
- Role-based backend security middleware.

---

# 💪 Backend

## 🚀 Project Overview

The backend handles:
- Authentication via Supabase
- CRUD operations for Clients, Projects, Reminders, Interactions
- Protected routes with JWT validation
- Dashboard Summaries

---

## 📖 Backend Tech Stack

| Area | Technology |
|:----|:-----------|
| Backend Framework | Node.js + Express.js |
| Language | TypeScript |
| Authentication | Supabase |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Validation | Zod |
| Environment | dotenv |

---

## 📀 Entity Relationship Diagram (ERD)

> Database structure representation:

![ERD Diagram](./erd.svg)

---

## ⚙️ Backend Setup Instructions

1. Clone the Project
```bash
git clone https://github.com/ronok420/mini-crm-for-freelancers.git
```

2. Move into Backend Directory
```bash
cd backend
```

3. Install Dependencies
```bash
npm install
```

4. Setup Environment Variables
Create a `.env` file inside `/backend` folder:

```dotenv
DATABASE_URL=your-session-pooler-supabase-postgres-url
SUPABASE_URL=your-supabase-instance-url
SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=5000
```

5. Generate Prisma Client
```bash
npx prisma generate
```

6. Run Backend Server
```bash
npm run dev
```

The backend will be running at:

```
http://localhost:5000/api/
```

---

## 📊 API Documentation

| Method | Endpoint | Purpose |
|:------|:--------|:--------|
| POST | `/api/auth/signup` | User Signup |
| POST | `/api/auth/login` | User Login |
| GET | `/api/clients` | Fetch Clients |
| POST | `/api/clients` | Create Client |
| PUT | `/api/clients/:id` | Update Client |
| DELETE | `/api/clients/:id` | Delete Client |
| GET | `/api/projects` | Fetch Projects |
| POST | `/api/projects` | Create Project |
| GET | `/api/reminders` | Fetch Reminders |
| POST | `/api/reminders` | Create Reminder |
| GET | `/api/logs` | Fetch Interaction Logs |
| POST | `/api/logs` | Create Interaction Log |
| GET | `/api/dashboard` | Dashboard Summary |

---

## 🔒 Secure Routes

All non-auth routes require:

```http
Authorization: Bearer <token>
```

---

## 📋 Postman Collection

You can import the Postman collection:

**Postman File:**
```text
/mini-crm-collection.json
```

---

## 📂 Backend Folder Structure

```bash
backend/
├── prisma/
│   ├── schema.prisma
│   └── ERD.png
├── src/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── validators/
│   ├── lib/
│   ├── routes/
│   ├── types/
│   └── index.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Happy Coding 🚀
