import { db, delay } from "./store";
import { GymProfile } from "./types";
import { emit } from "./events";

export const gymService = {
  async fetchGymProfile() {
    await delay();
    return db.gymProfile;
  },
  async saveGymProfile(payload: GymProfile) {
    await delay();
    db.gymProfile = payload;
    emit("gym:changed");
    return db.gymProfile;
  },
};
