# Rydo Video

## Setup

### Backend

```bash
cd Backend
npm install
copy .env.example .env
npm start
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Environment variables

Set the backend values in `Backend/.env` and the frontend values in `frontend/.env`.

Required backend variables:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `MAPTILER_API_KEY`
- `FRONTEND_URL`

Required frontend variables:

- `VITE_BASE_URL`
- `VITE_MAPTILER_API_KEY`
