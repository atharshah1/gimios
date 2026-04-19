import { AttendanceRecord, GymProfile, Member, SessionUser, TimeSlot, Trainer } from "./types";

export const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

/** Frozen demo date – all "today" logic should use this constant. */
export const TODAY = "2026-04-19";

export const db: {
  session: SessionUser;
  gymProfile: GymProfile;
  trainers: Trainer[];
  members: Member[];
  slots: TimeSlot[];
  attendance: AttendanceRecord[];
} = {
  session: { id: "owner-1", fullName: "Apex Owner", role: "gym_owner", gymSlug: "apex-athletics" },
  gymProfile: { gymName: "Apex Athletics", logoUrl: "https://example.com/logo.png", themePrimary: "#6366F1" },
  trainers: [
    { id: "trainer-1", name: "Alex Morgan" },
    { id: "trainer-2", name: "Sarah Jenkins" },
    { id: "trainer-3", name: "Daniel Reyes" },
    { id: "trainer-4", name: "Priya Nair" },
  ],
  members: [
    { id: "member-1", name: "Mike Ryan" },
    { id: "member-2", name: "Emma Davis" },
    { id: "member-3", name: "James Carter" },
    { id: "member-4", name: "Olivia Kim" },
    { id: "member-5", name: "Liam Chen" },
    { id: "member-6", name: "Sofia Patel" },
  ],
  slots: [
    // Today – trainer-1 has 3 sessions (2 members in morning group + 1 at noon)
    { id: "slot-1", date: TODAY, time: "09:00", trainerId: "trainer-1", trainerName: "Alex Morgan", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "slot-2", date: TODAY, time: "09:00", trainerId: "trainer-1", trainerName: "Alex Morgan", memberId: "member-3", memberName: "James Carter" },
    { id: "slot-3", date: TODAY, time: "12:00", trainerId: "trainer-1", trainerName: "Alex Morgan", memberId: "member-2", memberName: "Emma Davis" },
    // Today – trainer-2 afternoon
    { id: "slot-4", date: TODAY, time: "16:00", trainerId: "trainer-2", trainerName: "Sarah Jenkins", memberId: "member-4", memberName: "Olivia Kim" },
    // Upcoming
    { id: "slot-5", date: "2026-04-20", time: "08:00", trainerId: "trainer-4", trainerName: "Priya Nair", memberId: "member-5", memberName: "Liam Chen" },
    { id: "slot-6", date: "2026-04-21", time: "14:00", trainerId: "trainer-2", trainerName: "Sarah Jenkins", memberId: "member-6", memberName: "Sofia Patel" },
  ],
  attendance: [
    // Today's check-ins (drives "Today" metric on Owner Dashboard)
    { id: "att-1", date: TODAY, slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-2", date: TODAY, slot: "09:00 - Alex Morgan", status: "present", memberId: "member-3", memberName: "James Carter" },
    // Past week history for member-1 (powers Member Attendance History timeline)
    { id: "att-3", date: "2026-04-12", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-4", date: "2026-04-13", slot: "09:00 - Alex Morgan", status: "absent", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-5", date: "2026-04-14", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-6", date: "2026-04-15", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-7", date: "2026-04-16", slot: "09:00 - Alex Morgan", status: "absent", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-8", date: "2026-04-17", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
  ],
};
