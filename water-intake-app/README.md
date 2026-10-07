# AquaTrack: Water Intake Tracker

React (Vite) frontend + Node.js / Express / MongoDB backend with JWT auth.

```
water-intake-app/
├── backend/    Express API (MVC: config, models, controllers, routes, middleware)
└── frontend/   React app (pages, components, services, context)
```

## 1. MongoDB

- **Local:** install MongoDB Community Server and start the service. Default URI: `mongodb://127.0.0.1:27017/water_intake_db`
- **Atlas:** create a free cluster and use `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/water_intake_db`

## 2. Backend

```powershell
cd backend
npm install
```

Edit `backend/.env` (change `JWT_SECRET` to a long random value before deploying):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/water_intake_db
JWT_SECRET=water_intake_secret_123
CLIENT_URL=http://localhost:5173
```

```powershell
npm run dev
```

Expected output: `Server running on port 5000` and `MongoDB connected`.

## 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. `frontend/.env` holds the backend URL:

```
VITE_API_URL=http://localhost:5000/api
```

If you change the backend port or deploy it, update `VITE_API_URL` (frontend) and `CLIENT_URL` (backend CORS) to match.

## 4. API reference

All `/api/users` and `/api/water` routes need `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account, returns token + user |
| POST | /api/auth/login | Log in, returns token + user |
| GET | /api/users/profile | Get profile |
| PUT | /api/users/profile | Update name, email, age, weight, dailyWaterGoal |
| POST | /api/water | Add record `{amount, date?, time?, note?}` |
| GET | /api/water/today?date=YYYY-MM-DD | Total, goal, remaining, percentage, records, 7-day stats |
| GET | /api/water/history?date= or ?from=&to= | Records, total intake, daily totals |
| PUT | /api/water/:id | Edit own record |
| DELETE | /api/water/:id | Delete own record |

Dates are stored as `YYYY-MM-DD` strings and the frontend sends the browser's local date, so "today" is correct in every timezone.

### curl examples

```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@example.com","password":"secret123","dailyWaterGoal":2500}'

curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"asha@example.com","password":"secret123"}'

TOKEN=<paste token>

curl -X POST http://localhost:5000/api/water -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"amount":500,"note":"After workout"}'

curl "http://localhost:5000/api/water/today?date=2026-10-07" -H "Authorization: Bearer $TOKEN"
curl "http://localhost:5000/api/water/history?date=2026-10-07" -H "Authorization: Bearer $TOKEN"
```

## 5. Notes

- Passwords are hashed with bcryptjs; JWTs expire after 7 days.
- Every water query filters by the logged-in `userId`, so users can only read, edit or delete their own records.
- The JWT is kept in `localStorage` (simple and fine for a learning project). For production, consider httpOnly cookies.
- Expired or invalid tokens automatically log the user out and redirect to `/login`.
