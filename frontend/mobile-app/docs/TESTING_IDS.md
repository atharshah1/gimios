# Mobile Demo Testing IDs & Navigation (No Backend)

This app currently supports **frontend-only demo mode** using in-memory mock data from `src/services/*`.

## Primary testing IDs

- `tab-setup`
- `tab-dashboard`
- `tab-trainers`
- `tab-members`
- `tab-slots`
- `tab-attendance`
- `tab-billing`
- `tab-home`
- `tab-workouts`
- `tab-nutrition`
- `tab-community`
- `tab-membership`
- `tab-profile`
- `tab-schedule`
- `tab-clients`
- `tab-hrms`
- `tab-settings`

## Demo role switch controls

- `btn-dev-switch-member` (Trainer Settings)
- `btn-dev-switch-owner` (Trainer Settings)
- `btn-open-attendance-history` (Member Profile)
- `btn-attend-next-slot` (Member Profile)
- `btn-profile-switch-trainer` (Member Profile)
- `btn-profile-switch-owner` (Member Profile)

## Demo navigation flow

1. Start app as `gym_owner` and open `tab-dashboard`.
2. Visit `tab-trainers`, `tab-members`, and `tab-slots`.
3. Switch to `trainer` role from settings with `btn-dev-switch-member`/`btn-dev-switch-owner` flow.
4. Open trainer `tab-schedule` and `tab-clients`.
5. Switch to `member` and use `btn-open-attendance-history` and `btn-attend-next-slot`.
6. Return to owner and verify `tab-attendance` updates from mock events.

> Note: All demo actions are local mock actions for walkthroughs and do not call a backend.
