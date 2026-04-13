# GymOS Mobile Architecture & Screen Flow Diagram

This document captures the **React Native mobile information architecture** and **screen flows** for both Trainer and Member apps based on the current product plan and design references.

## 1) Mobile App Architecture (High Level)

```mermaid
flowchart TB
    A[GymOS Mobile App\nReact Native + Expo] --> B[Auth & Tenant Context]
    B --> C[Role Switch]

    C --> T[Trainer App Flow]
    C --> M[Member App Flow]

    T --> API[FastAPI Monolith API]
    M --> API

    API --> MOD1[Auth + RBAC]
    API --> MOD2[Gym + White-label Theme]
    API --> MOD3[HRMS + Users]
    API --> MOD4[Time Slots + Attendance]
    API --> MOD5[Workout]
    API --> MOD6[Wearable]
    API --> MOD7[Billing + Subscription]

    API --> DB[(PostgreSQL)]
    API --> R[(Redis)]
```

## 2) Trainer Screen Flow

```mermaid
flowchart TD
    TS[Trainer: Welcome / Role Select] --> TA[Create Account]
    TS --> TL[Sign In]

    TA --> TJ[Join Gym / Invite Code]
    TL --> TJ
    TJ --> TD[Trainer Dashboard]

    TD --> SCH[Schedule]
    TD --> CL[Client Directory]
    TD --> HR[HRMS Hub]
    TD --> BI[Billing & Invoices]
    TD --> ST[Settings]

    SCH --> SD[Session Details]
    SD --> CI[Check In / Check Out]
    SD --> WP[Workout Plan / Notes / Attachments]

    CL --> CP[Client Profile]
    CP --> BS[Book Session]
    CP --> MSG[Message Client]

    HR --> PR[Payroll & Compensation]
    HR --> AT[Attendance Trends]

    BI --> INV[Invoice Detail]
    INV --> MP[Mark Paid / Reminder]
```

## 3) Member Screen Flow

```mermaid
flowchart TD
    MW[Member Welcome] --> MC[Create Account]
    MW --> MS[Sign In]

    MC --> O1[Onboarding Step 1\nGoals + Experience]
    O1 --> O2[Onboarding Step 2\nBody + Gym + Injuries + Nutrition]
    O2 --> O3[Onboarding Step 3\nConnect Apple Health / Google Fit]
    O3 --> MH[Member Home]

    MS --> MH

    MH --> WO[Workouts Library]
    WO --> WD[Workout Detail]
    WD --> WL[Live Workout]
    WL --> WC[Workout Complete]

    MH --> NU[Nutrition Dashboard]
    NU --> LM[Log Meal]

    MH --> CO[Community]
    MH --> ME[Membership]
    MH --> PR[Profile / Preferences]

    PR --> WI[Wearable Integrations]
    PR --> AL[Alerts & Notifications]
```

## 4) Cross-Cutting Rules (Applied to all screens)

- **Multi-tenant isolation**: every user journey is gym-scoped (`gym_id`).
- **White-label rendering**: theme/logo resolved by tenant context.
- **Role-based access**:
  - Trainer sees assigned members and trainer workspace actions only.
  - Member sees personal data, workouts, attendance, wearables only.
- **Billing states affect access**: trial / active / suspended controls gated experiences.

