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

export type TimeSlot = { id: string; date: string; time: string; trainer: string; member: string };
export type AttendanceRecord = {
  id: string;
  date: string;
  slot: string;
  status: "present" | "absent";
  member: string;
};

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

let session: SessionUser = {
  id: "owner-1",
  fullName: "Apex Owner",
  role: "gym_owner",
  gymSlug: "apex-athletics",
};

let gymProfile: GymProfile = {
  gymName: "Apex Athletics",
  logoUrl: "https://example.com/logo.png",
  themePrimary: "#8BFF2A",
};

let trainers = ["Alex Morgan", "Sarah Jenkins"];
let members = ["Mike Ryan", "Emma Davis"];
let slots: TimeSlot[] = [
  { id: "slot-1", date: "2026-04-13", time: "09:00", trainer: "Sarah Jenkins", member: "Mike Ryan" },
];
let attendance: AttendanceRecord[] = [
  { id: "att-1", date: "2026-04-13", slot: "09:00 - Sarah Jenkins", status: "present", member: "Mike Ryan" },
];

export const mobileApi = {
  async fetchSession() {
    await delay();
    return session;
  },
  async switchRole(role: AppRole) {
    await delay();
    const name = role === "gym_owner" ? "Apex Owner" : role === "trainer" ? "Alex Morgan" : "Mike Ryan";
    session = { ...session, role, fullName: name, id: `${role}-1` };
    return session;
  },
  async fetchGymProfile() {
    await delay();
    return gymProfile;
  },
  async saveGymProfile(payload: GymProfile) {
    await delay();
    gymProfile = payload;
    return gymProfile;
  },
  async listTrainers() {
    await delay();
    return trainers;
  },
  async addTrainer(name: string) {
    await delay();
    trainers = [...trainers, name];
    return trainers;
  },
  async listMembers() {
    await delay();
    return members;
  },
  async addMember(name: string) {
    await delay();
    members = [...members, name];
    return members;
  },
  async listSlots() {
    await delay();
    return slots;
  },
  async createSlot(payload: Omit<TimeSlot, "id">) {
    await delay();
    const next = { id: `slot-${slots.length + 1}`, ...payload };
    slots = [...slots, next];
    return next;
  },
  async listAttendance() {
    await delay();
    return attendance;
  },
  async markAttendance(payload: Omit<AttendanceRecord, "id">) {
    await delay();
    const next = { id: `att-${attendance.length + 1}`, ...payload };
    attendance = [...attendance, next];
    return next;
  },
};
