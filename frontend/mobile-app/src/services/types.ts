export type AppRole = "gym_owner" | "trainer" | "member";

export type SessionUser = {
  id: string;
  fullName: string;
  role: AppRole;
  gymSlug: string;
};

export type GymProfile = {
  gymName: string;
  logoUrl: string;
  themePrimary: string;
};

export type Trainer = { id: string; name: string };
export type Member = { id: string; name: string };

export type TimeSlot = {
  id: string;
  date: string;
  time: string;
  trainerId: string;
  trainerName: string;
  memberId: string;
  memberName: string;
};

export type AttendanceRecord = {
  id: string;
  date: string;
  time: string;
  slot: string;
  status: "present" | "absent";
  memberId: string;
  memberName: string;
};
