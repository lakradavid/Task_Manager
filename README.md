# Task Manager — MERN Stack

A full-stack task management app with JWT auth, CRUD operations, filtering, and a responsive UI.

## Tech Stack
- **Frontend**: React 18, Vite, React Router, Axios, CSS Modules
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Deploy**: Frontend → Vercel | Backend → Render

---

## Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev            # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
npm run dev            # runs on http://localhost:5173
```

---

## Deployment

### Backend → Render
1. Push repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set root directory to `backend`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL)

### Frontend → Vercel
1. Create a new project on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/tasks | Yes | Get all tasks (filterable) |
| POST | /api/tasks | Yes | Create task |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |

### Task Filters (query params)
- `?status=todo|in-progress|done`
- `?priority=low|medium|high`
- `?search=keyword`
