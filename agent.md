# 🤖 GimIOS — GymOS SaaS Platform Agent Plan

> This document serves as the single source of truth for building the GymOS SaaS platform. It covers architecture decisions, feature breakdown, implementation steps, and the complete coding agent handoff.

---

## 🧠 1. Product Vision

### Product: GymOS SaaS Platform

A **multi-tenant SaaS platform** where:

- Gym owners subscribe (₹15,000/month)
- They receive a **customized, white-labeled branded app**
- They can manage: Members, Trainers (HRMS), Attendance, Workouts, and Wearables

### Key Differentiators

| Feature | Description |
|---|---|
| White-label | Custom logo + theme per gym |
| Trainer HRMS | Full HR management inside the gym app |
| Wearable Integration | Google Fit + Apple HealthKit |
| Time-slot Attendance | Slot-based check-in system |
| SaaS Billing | Razorpay subscription API |

---

## 🏗️ 2. Architecture

### Style: Single Backend Monolith (FastAPI)

**Why Monolith?**
- Faster MVP development
- Easier deployment (single Docker container)
- Lower infrastructure cost
- Fits MVP and early-scale needs

### High-Level Layout

```
Clients:
  - React Native App (iOS + Android)       → frontend/mobile-app/
  - React Admin Dashboard (Gym Owner)      → frontend/gym-dashboard/
  - Super Admin Dashboard (Internal)       → frontend/super-admin/

          ↓ HTTPS/REST/WebSocket

FastAPI Monolith Backend                   → backend/

Modules:
  - Auth & RBAC
  - Gym (tenant)
  - Users (trainer / member)
  - HRMS (trainer management)
  - Time Slots
  - Attendance
  - Workout
  - Wearable Integration
  - Billing (Razorpay)
  - White-label (theme + branding)
  - Analytics

          ↓

PostgreSQL  +  Redis
```

---

## ⚙️ 3. Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL 15 |
| Cache / Queue | Redis |
| Async tasks | Celery (post-MVP) |
| Mobile app | React Native (Expo) |
| Gym Owner Dashboard | React + Vite |
| Super Admin Dashboard | React + Vite |
| Payments | Razorpay Subscription API |
| Wearables | Google Fit API, Apple HealthKit |
| Deployment | Single Docker container (backend); Vercel / CDN (FE) |

---

## 📁 4. Repository File Structure

```
gimios/                                   ← monorepo root
│
├── agent.md                              ← this file
├── README.md
│
├── backend/                              ← FastAPI monolith
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py                       ← FastAPI app entry point
│       ├── api/
│       │   ├── __init__.py
│       │   ├── auth.py                   ← login, register, JWT refresh
│       │   ├── gym.py                    ← gym CRUD, branding
│       │   ├── users.py                  ← member & trainer user ops
│       │   ├── hrms.py                   ← trainer HR management
│       │   ├── timeslot.py               ← slot creation & assignment
│       │   ├── attendance.py             ← attendance marking
│       │   ├── workout.py                ← workout plans
│       │   ├── wearable.py               ← Google Fit / HealthKit
│       │   ├── billing.py                ← Razorpay integration
│       │   └── admin.py                  ← super admin endpoints
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py
│       │   ├── gym.py
│       │   ├── subscription.py
│       │   ├── trainer.py
│       │   ├── timeslot.py
│       │   ├── attendance.py
│       │   ├── workout.py
│       │   └── wearable.py
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── gym.py
│       │   ├── user.py
│       │   ├── hrms.py
│       │   ├── timeslot.py
│       │   ├── attendance.py
│       │   ├── workout.py
│       │   ├── wearable.py
│       │   └── billing.py
│       ├── services/
│       │   ├── __init__.py
│       │   ├── auth_service.py
│       │   ├── billing_service.py
│       │   ├── wearable_service.py
│       │   └── hrms_service.py
│       ├── core/
│       │   ├── __init__.py
│       │   ├── config.py                 ← env-driven settings (pydantic-settings)
│       │   ├── security.py               ← JWT, password hashing
│       │   └── database.py               ← SQLAlchemy engine + session
│       └── migrations/                   ← Alembic
│           └── ...
│
├── frontend/
│   ├── mobile-app/                       ← React Native (Expo)
│   │   ├── package.json
│   │   ├── app.json
│   │   └── src/
│   │       ├── screens/
│   │       ├── components/
│   │       ├── navigation/
│   │       └── services/                 ← API client, wearable hooks
│   │
│   ├── gym-dashboard/                    ← Gym Owner — React + Vite
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── pages/
│   │       ├── components/
│   │       └── api/
│   │
│   └── super-admin/                      ← Super Admin — React + Vite
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── pages/
│           ├── components/
│           └── api/
│
└── infra/
    └── docker-compose.yml                ← backend + postgres + redis
```

---

## 🧩 5. Feature Breakdown

### 👨‍💼 Gym Owner (Customer)

| Area | Features |
|---|---|
| Onboarding | Register gym, set app name, upload logo, pick theme colours |
| HRMS | Add/edit trainers, track attendance, working hours, performance |
| Operations | Add members, assign trainers, create time slots, view analytics |
| Billing | 15-day trial (super admin activates), ₹15k/month Razorpay subscription |

### 🏋️ Trainer

- View assigned members only
- Manage batches (time slots)
- Mark member attendance
- Assign workout plans

### 🧍 Member

- View assigned workouts
- View personal attendance history
- Sync wearable data (Google Fit / HealthKit)

### 🧑‍💻 Super Admin (Internal)

- View all registered gyms
- Activate 15-day trial for any gym
- Monitor active subscriptions, revenue, usage

---

## 🔐 6. Auth & RBAC

### Roles

| Role | Scope |
|---|---|
| `super_admin` | Platform-wide |
| `gym_owner` | Single tenant (gym) |
| `trainer` | Single gym, assigned members only |
| `member` | Own profile + gym data |

### JWT Strategy

- Access token: short-lived (15 min)
- Refresh token: long-lived (7 days), stored in Redis
- Every request carries `gym_id` (resolved from JWT or request header for white-label flows)

---

## 💳 7. Billing (Razorpay)

### Flow

```
Gym Owner → Create Subscription (₹15,000/month)
         → Razorpay generates subscription_id
         → Store subscription_id + status in DB

Webhook events:
  subscription.activated  → set gym.status = ACTIVE
  subscription.charged    → update next_billing_date
  subscription.halted     → set gym.status = SUSPENDED
  subscription.cancelled  → set gym.status = CANCELLED
```

### Trial System

- Super admin calls `POST /admin/gyms/{gym_id}/activate-trial`
- Sets `trial_start = now()`, `trial_end = now() + 15 days`
- Celery task (or scheduled check) suspends gym when `trial_end < now()` and no active subscription

---

## ⌚ 8. Wearable Integration

### Google Fit

1. Member triggers OAuth2 flow from mobile app
2. App receives `access_token` → stores in backend (`UserIntegration` table)
3. Backend (Celery / cron) calls Fit API daily → stores aggregated `WearableData`

### Apple HealthKit

1. iOS app requests HealthKit permission
2. App reads steps/calories → pushes to `POST /wearable/sync`
3. Backend upserts `WearableData` row per `(user_id, date)`

### WearableData Schema

```
WearableData:
  id          UUID PK
  user_id     FK → users.id
  gym_id      FK → gyms.id   ← multi-tenant column
  date        DATE
  steps       INT
  calories    FLOAT
  source      ENUM(google_fit, apple_health)
  created_at  TIMESTAMPTZ
  UNIQUE(user_id, date, source)
```

---

## 🗄️ 9. Data Models (Key Tables)

### Gym (Tenant)

```
gyms:
  id            UUID PK
  name          TEXT
  slug          TEXT UNIQUE         ← used for white-label subdomain
  logo_url      TEXT
  theme_primary TEXT
  theme_secondary TEXT
  status        ENUM(trial, active, suspended, cancelled)
  trial_start   TIMESTAMPTZ
  trial_end     TIMESTAMPTZ
  created_at    TIMESTAMPTZ
```

### User

```
users:
  id            UUID PK
  gym_id        UUID FK → gyms.id   ← ALWAYS filtered in queries
  email         TEXT UNIQUE(gym_id, email)
  hashed_password TEXT
  role          ENUM(gym_owner, trainer, member)
  full_name     TEXT
  is_active     BOOL
  created_at    TIMESTAMPTZ
```

### Attendance

```
attendances:
  id            UUID PK
  gym_id        UUID FK
  user_id       UUID FK
  slot_id       UUID FK
  date          DATE
  status        ENUM(present, absent)
  marked_by     UUID FK → users.id
  UNIQUE(user_id, slot_id, date)
```

### Subscription

```
subscriptions:
  id                  UUID PK
  gym_id              UUID FK UNIQUE
  razorpay_sub_id     TEXT UNIQUE
  plan_amount         INT  DEFAULT 1500000  ← paise
  status              TEXT
  current_start       TIMESTAMPTZ
  current_end         TIMESTAMPTZ
  created_at          TIMESTAMPTZ
```

---

## 🐳 10. Docker Setup

### backend/Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### infra/docker-compose.yml

```yaml
version: "3.9"
services:
  backend:
    build: ../backend
    ports:
      - "8000:8000"
    env_file: ../backend/.env
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: gymos
      POSTGRES_PASSWORD: gymos
      POSTGRES_DB: gymos
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

---

## ⚠️ 11. Edge Cases & Mitigations

| Area | Edge Case | Mitigation |
|---|---|---|
| Billing | Trial expired, user still active | Nightly Celery task checks `trial_end`; suspends gym |
| Billing | Payment failed (Razorpay webhook) | Set gym status → `suspended`; notify owner via email |
| Billing | Duplicate subscriptions | UNIQUE constraint on `gym_id` in subscriptions table |
| Multi-tenant | Data leakage | Every query MUST include `gym_id` filter; row-level security option in Postgres |
| Multi-tenant | Wrong theme applied | Theme resolved from JWT `gym_id` → gyms table; never from client payload |
| Wearables | Device disconnected | Mark `UserIntegration.is_active = False`; skip sync |
| Wearables | Data duplication | UNIQUE constraint on `(user_id, date, source)` |
| Wearables | Timezone mismatch | Store all timestamps in UTC; convert to user TZ only in FE |
| HRMS | Trainer leaves gym | Soft-delete; retain historical attendance records |
| HRMS | Trainer reassignment | New `TrainerAssignment` record; old one closed with `end_date` |
| Attendance | Duplicate marking | UNIQUE constraint on `(user_id, slot_id, date)` |
| Attendance | Wrong time slot | Validate `slot.gym_id == current_user.gym_id` before marking |

---

## 🚀 12. MVP Scope

### ✅ In MVP

| Category | Feature |
|---|---|
| Auth | JWT auth + roles + multi-tenant isolation |
| Gym | Creation + theme + branding |
| HRMS | Add trainers, track trainer attendance |
| Time Slots | Create slots, assign members |
| Attendance | Mark & view attendance |
| Workout | Assign + fetch workout plans |
| Billing | 15-day trial, Razorpay ₹15k/month subscription |
| Wearables | Google Fit basic integration |
| Super Admin | View gyms, enable trial, monitor subscriptions |

### ❌ Not in MVP

- AI-powered diet plans
- Advanced analytics / reports
- Push notifications
- Apple HealthKit (post-MVP, mobile client required)
- Celery async tasks (synchronous for MVP)

---

## 📋 13. Implementation Steps (Ordered)

```
Step 1:  Project scaffold — directory structure, Dockerfile, requirements.txt
Step 2:  Core — config.py (pydantic-settings), database.py (SQLAlchemy), security.py (JWT + bcrypt)
Step 3:  Models — Gym, User, Subscription, Trainer, TimeSlot, Attendance, Workout, WearableData
Step 4:  Alembic migrations init
Step 5:  Auth API — register, login, refresh token, RBAC middleware
Step 6:  Gym API — create gym, upload logo, update theme
Step 7:  Users API — invite trainer, add member, list users
Step 8:  HRMS API — trainer profile, attendance, working hours
Step 9:  Time Slot API — CRUD, assign members
Step 10: Attendance API — mark, unmark, view history
Step 11: Workout API — create plan, assign to member, view
Step 12: Billing API — create Razorpay subscription, handle webhook
Step 13: Trial API (super admin) — activate trial, list gyms, monitor
Step 14: Wearable API — Google Fit OAuth, data sync endpoint
Step 15: Frontend scaffolds — mobile-app (Expo), gym-dashboard (Vite), super-admin (Vite)
Step 16: CI/CD — GitHub Actions, Docker build, deploy
```

---

## ✅ 14. Acceptance Criteria

### Gym Owner
- [ ] Can register gym with branding
- [ ] Can manage trainers (add/edit/deactivate)
- [ ] Can manage members
- [ ] Can create time slots and assign members
- [ ] Can view attendance analytics

### Trainer
- [ ] Sees only their assigned members
- [ ] Can mark attendance for their slots
- [ ] Can assign workouts to members

### Member
- [ ] Can view assigned workouts
- [ ] Can view own attendance history
- [ ] Can sync Google Fit data

### Super Admin
- [ ] Can view all gyms and their status
- [ ] Can activate a 15-day trial for any gym
- [ ] Can monitor subscription revenue and usage

### System
- [ ] Razorpay billing flow works end-to-end
- [ ] Trial expires correctly (no active subscription after `trial_end`)
- [ ] No cross-tenant data leaks (gym_id enforced everywhere)
- [ ] Google Fit sync stores aggregated daily data
- [ ] API response time < 300ms under normal load

---

## 🔗 15. Environment Variables

```env
# Backend .env
DATABASE_URL=postgresql+asyncpg://gymos:gymos@db:5432/gymos
REDIS_URL=redis://redis:6379/0
SECRET_KEY=change-me-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

GOOGLE_FIT_CLIENT_ID=
GOOGLE_FIT_CLIENT_SECRET=

SUPER_ADMIN_EMAIL=admin@gymos.in
```

---

*Last updated: April 2026 | Maintained by the GimIOS core team*

---

## 🔄 16. Mobile Event-Driven Sync & Loading Contract (Frontend ↔ Backend)

To avoid polling-heavy behavior on mobile, use an **event-driven data sync model**.

### Current Frontend Contract (implemented)

- Hooks subscribe to domain events and refresh on mutation:
  - `roster:changed`
  - `slots:changed`
  - `attendance:changed`
  - `gym:changed`
  - `session:changed`
- Loading states in screens should render **skeleton blocks** (not only spinner/text) for perceived performance.

### Preferred Backend Contract (when API is available)

Implement one of the following in priority order:

1. **WebSocket / SSE push events** (recommended)
   - Emit domain events after write operations.
   - Suggested event payload:

```json
{
  "event": "slots:changed",
  "gym_id": "uuid",
  "entity_id": "slot-123",
  "action": "created",
  "timestamp": "2026-04-13T10:00:00Z"
}
```

2. **Webhook-style internal event bus** (if websocket deferred)
   - Backend modules publish domain events.
   - Gateway/notification layer fans out to connected mobile clients.

3. **Fallback (no push available)**
   - Manual refresh only (user-initiated pull-to-refresh).
   - Avoid high-frequency polling.

### API Endpoints expected for Owner → Trainer → Member flow

- `POST /timeslots` (owner creates slot)
- `GET /timeslots?trainer_id=...&date=...` (trainer schedule)
- `POST /attendance` (trainer/member mark attendance)
- `GET /attendance?member_id=...` (member history)
- `GET /attendance?gym_id=...` (owner overview)

### UX Rule

- Any screen that depends on async domain data (slots, roster, attendance) must show:
  1. skeleton loading,
  2. error state,
  3. empty state.
- Mobile UI screens should support pull-to-refresh for manual sync fallback; in current RN implementation this is attached in the shared `ScreenShell` component so all screen flows can trigger refresh actions when provided.

## 🖥️ 17. Web App Focus (Admin + Gym Owner Dashboard)

When shifting from mobile-first to web-first implementation:

- `frontend/gym-dashboard/` should implement Gym Owner operational flows:
  - Create Gym / Branding
  - Add Trainers
  - Add Members
  - Create Time Slots
  - View Attendance
  - Billing / Subscription
- `frontend/super-admin/` should implement platform control flows:
  - View all gyms
  - Activate 15-day trial
  - Monitor active gyms and revenue

For MVP, mock state is acceptable in FE components; later wire APIs from `backend/app/api/*`.
- Persistence note: native mobile durable session storage should use AsyncStorage/SecureStore in a later phase; current implementation keeps a lightweight persistence adapter contract without adding native storage dependencies yet.
