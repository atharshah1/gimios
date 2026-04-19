import { AttendanceRecord, GymProfile, Member, SessionUser, TimeSlot, Trainer } from "./types";

export const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const db: {
  session: SessionUser;
  gymProfile: GymProfile;
  trainers: Trainer[];
  members: Member[];
  slots: TimeSlot[];
  attendance: AttendanceRecord[];
} = {
  session: { id: "owner-1", fullName: "Apex Owner", role: "gym_owner", gymSlug: "apex-athletics" },
  gymProfile: { gymName: "Apex Athletics", logoUrl: "https://example.com/logo.png", themePrimary: "#8BFF2A" },
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
    { id: "slot-1", date: "2026-04-13", time: "09:00", trainerId: "trainer-1", trainerName: "Alex Morgan", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "slot-2", date: "2026-04-14", time: "10:00", trainerId: "trainer-2", trainerName: "Sarah Jenkins", memberId: "member-2", memberName: "Emma Davis" },
    { id: "slot-3", date: "2026-04-15", time: "11:00", trainerId: "trainer-1", trainerName: "Alex Morgan", memberId: "member-3", memberName: "James Carter" },
    { id: "slot-4", date: "2026-04-16", time: "07:00", trainerId: "trainer-3", trainerName: "Daniel Reyes", memberId: "member-4", memberName: "Olivia Kim" },
    { id: "slot-5", date: "2026-04-17", time: "08:00", trainerId: "trainer-4", trainerName: "Priya Nair", memberId: "member-5", memberName: "Liam Chen" },
    { id: "slot-6", date: "2026-04-18", time: "14:00", trainerId: "trainer-2", trainerName: "Sarah Jenkins", memberId: "member-6", memberName: "Sofia Patel" },
  ],
  attendance: [
    { id: "att-1", date: "2026-04-06", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-2", date: "2026-04-07", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-3", date: "2026-04-08", slot: "09:00 - Alex Morgan", status: "absent", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-4", date: "2026-04-09", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-5", date: "2026-04-10", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-6", date: "2026-04-11", slot: "09:00 - Alex Morgan", status: "absent", memberId: "member-1", memberName: "Mike Ryan" },
    { id: "att-7", date: "2026-04-12", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-2", memberName: "Emma Davis" },
    { id: "att-8", date: "2026-04-13", slot: "09:00 - Alex Morgan", status: "present", memberId: "member-2", memberName: "Emma Davis" },
  ],
};
