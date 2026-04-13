# GymOS Mobile Architecture & Screen Flow Diagram

This document reflects the implemented navigation architecture with role/session bootstrap, API-style hooks, and connected owner → trainer → member flows.

## 1) Architecture (Providers + Hooks + Navigation)

```mermaid
flowchart TB
    A[App.tsx] --> B[RoleProvider]
    B --> C[ThemeProvider]
    C --> D[AppNavigator]

    B --> API[/services/api.ts]
    D --> H1[/hooks/useAuth.ts]
    D --> H2[/hooks/useSlots.ts]
    D --> H3[/hooks/useAttendance.ts]
    D --> H4[/hooks/useRoster.ts]

    D --> NAV[Root Stack + Role Tabs]
```

## 2) Gym Owner Flow

```mermaid
flowchart TD
    SU[Signup] --> CG[Create Gym Form]
    CG --> LU[Upload Logo URL]
    LU --> ST[Select Theme]
    ST --> OD[Owner Dashboard]

    OD --> AT[Add Trainer Form]
    OD --> AM[Add Member Form]
    OD --> CS[Create Slot Form]
    OD --> VA[Attendance Overview]
    OD --> BI[Billing / Subscription]
```

## 3) Connected Operational Flow

```mermaid
flowchart LR
    OWNER[Owner creates slot via form] --> TRAINER[Trainer Schedule reads slots]
    TRAINER --> MARK[Trainer marks attendance]
    MARK --> MEMBER[Member profile / history]
    MEMBER --> OWNER_VIEW[Owner attendance dashboard]
```

## 4) Member Attendance Flow

```mermaid
flowchart TD
    PR[Profile] --> AH[Attendance History]
    AH --> ROWS[Date + Slot + Status]
```

## 5) Loading UX

```mermaid
flowchart LR
    START[App Start] --> SKELETON[Skeleton Loading Screen]
    SKELETON --> READY[Session + Role Ready]
    SKELETON --> ERROR[Session Error]
```

## 6) Notes

- Role and user identity are session-driven (not hardcoded per screen).
- Ops state is now API-hook structured (`services` + `hooks`) and ready for backend replacement.
- Custom tabs are kept for now; can be swapped to `@react-navigation/bottom-tabs` later.
