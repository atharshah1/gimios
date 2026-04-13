export type Status = "active" | "inactive";

export type Trainer = {
  id: string;
  name: string;
  sessionsHandled: number;
  attendanceRate: number;
  activeClients: number;
  assignedMemberIds: string[];
  status: Status;
};

export type Member = {
  id: string;
  name: string;
  membershipStatus: "active" | "paused" | "expired";
  assignedTrainerId?: string;
  paymentStatus: "paid" | "pending" | "failed";
  attendanceHistory: { date: string; present: boolean }[];
};

export type Slot = {
  id: string;
  title: string;
  date: string;
  startHour: number;
  durationMin: number;
  trainerId: string;
  memberIds: string[];
};

export type AttendanceRecord = {
  id: string;
  date: string;
  memberId: string;
  trainerId: string;
  slotId: string;
  status: "present" | "absent";
};

export type Plan = { id: string; name: string; amount: number; durationDays: number };

export type Payment = {
  id: string;
  memberId?: string;
  gymId?: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
};

export type GymSettings = {
  gymName: string;
  logoUrl: string;
  theme: "dark" | "light";
  workingHours: string;
  slotDuration: number;
  notificationsEnabled: boolean;
};

export type DashboardMetric = {
  totalMembers: number;
  activeTrainers: number;
  attendancePercent: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
};

export type TrendPoint = { label: string; attendance: number; revenue: number; members: number };

export type PlatformGym = {
  id: string;
  name: string;
  status: "trial" | "active" | "disabled";
  members: number;
  trainers: number;
  revenue: number;
  plan: string;
};

export type PlatformUser = { id: string; name: string; role: "owner" | "trainer" | "member"; gymName: string; lastActive: string };
