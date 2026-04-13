import type { AttendanceRecord, GymSettings, Member, Payment, Plan, PlatformGym, PlatformUser, Slot, Trainer, TrendPoint } from "../types";
import { readPersisted, writePersisted } from "./persistence";

export const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

type PersistedState = {
  settings: GymSettings;
  trainers: Trainer[];
  members: Member[];
  slots: Slot[];
  attendance: AttendanceRecord[];
  plans: Plan[];
  payments: Payment[];
};
type SessionUser = { id: string; name: string; role: "gym_owner" | "super_admin" };
type SessionState = { user: SessionUser | null; token: string };

const initialState: PersistedState = {
  settings: {
    gymName: "Apex Athletics",
    logoUrl: "https://placehold.co/96x96",
    theme: "dark",
    workingHours: "06:00 - 22:00",
    slotDuration: 60,
    notificationsEnabled: true,
  } as GymSettings,
  trainers: [
    { id: "t1", name: "Alex Morgan", sessionsHandled: 68, attendanceRate: 91, activeClients: 24, assignedMemberIds: ["m1", "m2"], status: "active" },
    { id: "t2", name: "Sara Lee", sessionsHandled: 53, attendanceRate: 88, activeClients: 19, assignedMemberIds: ["m3"], status: "active" },
  ] as Trainer[],
  members: [
    { id: "m1", name: "Mike Ryan", membershipStatus: "active", assignedTrainerId: "t1", paymentStatus: "paid", attendanceHistory: [{ date: "2026-04-12", present: true }, { date: "2026-04-11", present: false }] },
    { id: "m2", name: "Zara Khan", membershipStatus: "active", assignedTrainerId: "t1", paymentStatus: "pending", attendanceHistory: [{ date: "2026-04-12", present: true }] },
    { id: "m3", name: "Tom Holt", membershipStatus: "paused", assignedTrainerId: "t2", paymentStatus: "paid", attendanceHistory: [{ date: "2026-04-12", present: false }] },
  ] as Member[],
  slots: [
    { id: "s1", title: "Morning HIIT", date: "2026-04-13", startHour: 7, durationMin: 60, trainerId: "t1", memberIds: ["m1", "m2"] },
    { id: "s2", title: "Strength Circuit", date: "2026-04-13", startHour: 18, durationMin: 60, trainerId: "t2", memberIds: ["m3"] },
  ] as Slot[],
  attendance: [
    { id: "a1", date: "2026-04-13", memberId: "m1", trainerId: "t1", slotId: "s1", status: "present" },
    { id: "a2", date: "2026-04-13", memberId: "m2", trainerId: "t1", slotId: "s1", status: "absent" },
  ] as AttendanceRecord[],
  plans: [
    { id: "p1", name: "Monthly", amount: 2500, durationDays: 30 },
    { id: "p2", name: "Quarterly", amount: 6500, durationDays: 90 },
  ] as Plan[],
  payments: [
    { id: "pay1", memberId: "m1", amount: 2500, status: "paid", date: "2026-04-03" },
    { id: "pay2", memberId: "m2", amount: 2500, status: "pending", date: "2026-04-09" },
  ] as Payment[],
};

const persisted = readPersisted<PersistedState>("gymos.web.state", initialState);

export const store = {
  auth: readPersisted<SessionState>("gymos.web.session", { user: { id: "u1", name: "Neha Owner", role: "gym_owner" }, token: "demo-token" }),
  ...persisted,
  trends: [
    { label: "Mon", attendance: 82, revenue: 18000, members: 118 },
    { label: "Tue", attendance: 79, revenue: 19500, members: 121 },
    { label: "Wed", attendance: 84, revenue: 20500, members: 124 },
    { label: "Thu", attendance: 77, revenue: 16700, members: 125 },
    { label: "Fri", attendance: 86, revenue: 22600, members: 128 },
    { label: "Sat", attendance: 89, revenue: 24100, members: 130 },
    { label: "Sun", attendance: 73, revenue: 15300, members: 130 },
  ] as TrendPoint[],
  platformGyms: [
    { id: "g1", name: "Apex Athletics", status: "active", members: 130, trainers: 9, revenue: 15000, plan: "Pro" },
    { id: "g2", name: "FitMe Studio", status: "trial", members: 72, trainers: 5, revenue: 0, plan: "Trial" },
    { id: "g3", name: "CoreLab", status: "disabled", members: 40, trainers: 4, revenue: 5000, plan: "Basic" },
  ] as PlatformGym[],
  platformUsers: [
    { id: "pu1", name: "Anita", role: "owner", gymName: "Apex Athletics", lastActive: "2026-04-13" },
    { id: "pu2", name: "Rahul", role: "trainer", gymName: "FitMe Studio", lastActive: "2026-04-11" },
    { id: "pu3", name: "Maya", role: "member", gymName: "Apex Athletics", lastActive: "2026-04-12" },
  ] as PlatformUser[],
};

export function persistStore() {
  writePersisted("gymos.web.state", {
    settings: store.settings,
    trainers: store.trainers,
    members: store.members,
    slots: store.slots,
    attendance: store.attendance,
    plans: store.plans,
    payments: store.payments,
  });
  writePersisted("gymos.web.session", store.auth);
}
