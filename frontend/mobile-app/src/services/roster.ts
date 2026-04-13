import { db, delay } from "./store";
import { emit } from "./events";

export const rosterService = {
  async listTrainers() {
    await delay();
    return db.trainers;
  },
  async addTrainer(name: string) {
    await delay();
    const next = { id: `trainer-${db.trainers.length + 1}`, name };
    db.trainers = [...db.trainers, next];
    emit("roster:changed");
    return db.trainers;
  },
  async listMembers() {
    await delay();
    return db.members;
  },
  async addMember(name: string) {
    await delay();
    const next = { id: `member-${db.members.length + 1}`, name };
    db.members = [...db.members, next];
    emit("roster:changed");
    return db.members;
  },
};
