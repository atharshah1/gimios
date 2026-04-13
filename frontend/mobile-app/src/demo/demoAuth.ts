// Demo Auth System (Multi-role runtime switching)

export type DemoRole = "gym_owner" | "trainer" | "member";

export interface DemoUser {
  id: string;
  role: DemoRole;
  name: string;
}

export const demoUsers: DemoUser[] = [
  { id: "owner-1", role: "gym_owner", name: "Owner" },
  { id: "trainer-1", role: "trainer", name: "Trainer" },
  { id: "member-1", role: "member", name: "Member" },
];

let currentUser: DemoUser = demoUsers[0];

const listeners: ((user: DemoUser) => void)[] = [];

export function getDemoUser(): DemoUser {
  return currentUser;
}

export function switchDemoUser(role: DemoRole) {
  const user = demoUsers.find((u) => u.role === role);
  if (!user) return;
  currentUser = user;
  listeners.forEach((l) => l(currentUser));
}

export function subscribeDemoUser(cb: (user: DemoUser) => void) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}
