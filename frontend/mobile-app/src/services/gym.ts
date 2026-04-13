import { db, delay } from "./store";
import { GymProfile } from "./types";

export const gymService = {
  async fetchGymProfile() {
    await delay();
    return db.gymProfile;
  },
  async saveGymProfile(payload: GymProfile) {
    await delay();
    db.gymProfile = payload;
    return db.gymProfile;
  },
};
