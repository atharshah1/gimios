# GymOS Mobile Architecture & Screen Flow Diagram

This document reflects the implemented navigation architecture using **React Navigation (Native Stack + Bottom Tabs)** and role bootstrapping from session/JWT claims.

## 1) Mobile Architecture (Stack + Tabs)

```mermaid
flowchart TB
    A[App.tsx] --> B[RoleProvider]
    B --> C[Session Bootstrap\nJWT claims: role + gym_slug]
    C --> D[ThemeProvider\nwhite-label colors per gym]
    D --> E[NavigationContainer]
    E --> F[Root Native Stack]

    F -->|role=trainer| TABS1[Trainer Bottom Tabs]
    F -->|role=member| TABS2[Member Bottom Tabs]

    TABS1 --> TS1[Dashboard]
    TABS1 --> TS2[Schedule]
    TABS1 --> TS3[Clients]
    TABS1 --> TS4[HRMS]
    TABS1 --> TS5[Billing]
    TABS1 --> TS6[Settings]

    F --> TD1[Trainer Stack: SessionDetails]
    F --> TD2[Trainer Stack: ClientProfile]

    TABS2 --> MS1[Home]
    TABS2 --> MS2[Workouts]
    TABS2 --> MS3[Nutrition]
    TABS2 --> MS4[Community]
    TABS2 --> MS5[Membership]
    TABS2 --> MS6[Profile]

    F --> MD1[Member Stack: WorkoutDetail]
    F --> MD2[Member Stack: LiveWorkout]
```

## 2) Trainer Screen Flow

```mermaid
flowchart TD
    TL[Session Loaded as Trainer] --> TD[Dashboard Tab]
    TD --> SCH[Schedule Tab]
    TD --> CL[Clients Tab]
    TD --> HR[HRMS Tab]
    TD --> BI[Billing Tab]
    TD --> ST[Settings Tab]

    SCH --> SD[Session Details Stack Screen]
    CL --> CP[Client Profile Stack Screen]

    BI --> PF[Payment Failed State]
    CL --> EC[Empty Clients State]
```

## 3) Member Screen Flow

```mermaid
flowchart TD
    ML[Session Loaded as Member] --> MH[Home Tab]
    MH --> WO[Workouts Tab]
    MH --> NU[Nutrition Tab]
    MH --> CO[Community Tab]
    MH --> ME[Membership Tab]
    MH --> PR[Profile Tab]

    WO --> WD[Workout Detail Stack Screen]
    WD --> LW[Live Workout Stack Screen]

    WO --> OF[Offline State]
```

## 4) Global UX States

```mermaid
flowchart LR
    START[App Start] --> LOADING[Loading: Restoring Session]
    LOADING --> READY[Role Resolved]
    LOADING --> ERROR[Error: Session Restore Failed]
    ERROR --> RETRY[Retry]
    RETRY --> LOADING
```

## 5) Rules

- Role selection in production comes from backend JWT claims (`role`) and tenant context (`gym_slug`).
- White-label theme is injected via `ThemeProvider` (dynamic token map per gym).
- Empty, error, and offline states are first-class UX states in relevant screens.
