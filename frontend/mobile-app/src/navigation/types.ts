export type OwnerTabParamList = {
  Setup: undefined;
  Dashboard: undefined;
  Trainers: undefined;
  Members: undefined;
  Slots: undefined;
  Attendance: undefined;
  Billing: undefined;
};

export type TrainerTabParamList = {
  Dashboard: undefined;
  Schedule: undefined;
  Clients: undefined;
  Billing: undefined;
  Profile: undefined;
};

export type MemberTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Nutrition: undefined;
  Community: undefined;
  Membership: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  OwnerTabs: undefined;
  TrainerTabs: undefined;
  MemberTabs: undefined;
  SessionDetails: { sessionKey: string };
  ClientProfile: { clientId: string; clientName: string };
  WorkoutDetail: { workoutId: string; workoutName: string };
  LiveWorkout: { workoutId: string; workoutName: string };
  AttendanceHistory: undefined;
};
