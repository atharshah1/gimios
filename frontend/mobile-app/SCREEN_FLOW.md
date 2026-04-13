# GymOS Mobile Architecture & Screen Flow Diagram

This document reflects the implemented navigation architecture using **React Navigation (Native Stack + Bottom Tabs)** and role bootstrapping from session/JWT claims.

## 1) Mobile Architecture (Stack + Tabs)

```mermaid
flowchart TB
    A[App.tsx] --> B[RoleProvider]
    B --> C[Session Bootstrap\nJWT claims: role + gym_slug]
    C --> D[ThemeProvider\nwhite-label colors per gym]
    D --> O[OpsProvider\nshared slots + attendance state]
    O --> E[NavigationContainer]
    E --> F[Root Native Stack]

    F -->|gym_owner| OT[Owner Tabs]
    F -->|trainer| TT[Trainer Tabs]
    F -->|member| MT[Member Tabs]
```

## 2) Gym Owner Flow (Top Priority)

```mermaid
flowchart TD
    SU[Signup] --> CG[Create Gym]
    CG --> LU[Upload Logo]
    LU --> ST[Select Theme]
    ST --> OD[Owner Dashboard]

    OD --> AT[Add Trainers]
    OD --> AM[Add Members]
    OD --> CS[Create Time Slots]
    OD --> VA[View Attendance]
    OD --> BI[Billing / Subscription]
```

## 3) Connected Operational Flow

```mermaid
flowchart LR
    OWNER[Gym Owner creates slot] --> TRAINER[Trainer sees schedule]
    TRAINER --> MEMBER[Member attends slot]
    MEMBER --> ATT[Attendance recorded]
    ATT --> OWNER_VIEW[Owner attendance dashboard updates]
    ATT --> MEMBER_VIEW[Member attendance history updates]
```

## 4) Member Attendance Flow

```mermaid
flowchart TD
    PR[Profile] --> AH[Attendance History]
    AH --> ROWS[Date + Slot + Status]
```

## 5) Global UX States

```mermaid
flowchart LR
    START[App Start] --> LOADING[Loading: Restoring Session]
    LOADING --> READY[Role Resolved]
    LOADING --> ERROR[Error: Session Restore Failed]
    ERROR --> RETRY[Retry]
    RETRY --> LOADING
```

## 6) Rules

- Role in production comes from backend JWT claims (`gym_owner`, `trainer`, `member`).
- White-label theme is injected via `ThemeProvider` (dynamic token map per gym).
- Flows are connected via shared operational state: slots and attendance updates propagate across owner/trainer/member screens.
