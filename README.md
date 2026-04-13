# gimios — GymOS SaaS Platform

A **multi-tenant SaaS platform** for gym management with white-label apps, trainer HRMS, attendance, workouts, wearable integration, and Razorpay billing.

## Repository Layout

```
gimios/
├── agent.md               ← Architecture plan & coding agent handoff
├── backend/               ← FastAPI monolith (Python 3.11)
│   ├── app/
│   │   ├── main.py
│   │   ├── api/           ← REST endpoints (auth, gym, users, hrms, …)
│   │   ├── models/        ← SQLAlchemy ORM models
│   │   ├── services/      ← Business logic
│   │   └── core/          ← Config, security, DB session
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── mobile-app/        ← React Native (Expo) — iOS + Android
│   ├── gym-dashboard/     ← React + Vite — Gym Owner panel
│   └── super-admin/       ← React + Vite — Internal admin panel
└── infra/
    └── docker-compose.yml ← backend + postgres + redis
```

## Quick Start (Docker)

```bash
cp backend/.env.example backend/.env   # fill in secrets
cd infra
docker compose up --build
```

API will be available at `http://localhost:8000`  
Swagger UI: `http://localhost:8000/docs`

## See Also

- [agent.md](./agent.md) — full architecture plan, feature breakdown, and implementation roadmap
- [frontend/mobile-app/SCREEN_FLOW.md](./frontend/mobile-app/SCREEN_FLOW.md) — mobile architecture and trainer/member screen flow diagrams
