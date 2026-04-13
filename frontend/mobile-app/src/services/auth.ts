import { db, delay } from "./store";
import { AppRole } from "./types";

export const authService = {
  async fetchSession() {
    await delay();
    return db.session;
  },
  async switchRole(role: AppRole) {
    await delay();
    const map = {
      gym_owner: { id: "owner-1", fullName: "Apex Owner" },
      trainer: { id: "trainer-1", fullName: "Alex Morgan" },
      member: { id: "member-1", fullName: "Mike Ryan" },
    } as const;
    db.session = { ...db.session, role, id: map[role].id, fullName: map[role].fullName };
    return db.session;
  },
};
