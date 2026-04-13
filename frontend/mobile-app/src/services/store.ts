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
  ],
  members: [
    { id: "member-1", name: "Mike Ryan" },
    { id: "member-2", name: "Emma Davis" },
  ],
  slots: [
    {
      id: "slot-1",
      date: "2026-04-13",
      time: "09:00",
      trainerId: "trainer-2",
      trainerName: "Sarah Jenkins",
      memberId: "member-1",
      memberName: "Mike Ryan",
    },
  ],
  attendance: [
    {
      id: "att-1",
      date: "2026-04-13",
      slot: "09:00 - Sarah Jenkins",
      status: "present",
      memberId: "member-1",
      memberName: "Mike Ryan",
    },
  ],
};
