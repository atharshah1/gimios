import { emit } from "../events";
import type { Member, Trainer } from "../types";
import { delay, store } from "./store";

export const gymService = {
  async getSettings() {
    await delay();
    return store.settings;
  },
  async updateSettings(next: Partial<typeof store.settings>) {
    await delay();
    store.settings = { ...store.settings, ...next };
    emit("gym:changed");
  },
  async getTrainers() {
    await delay();
    return store.trainers;
  },
  async upsertTrainer(input: Partial<Trainer> & Pick<Trainer, "name">) {
    await delay();
    if (input.id) {
      store.trainers = store.trainers.map((t) => (t.id === input.id ? { ...t, ...input } as Trainer : t));
    } else {
      store.trainers.push({
        id: `t${store.trainers.length + 1}`,
        name: input.name,
        sessionsHandled: 0,
        attendanceRate: 0,
        activeClients: 0,
        assignedMemberIds: [],
        status: "active",
      });
    }
    emit("gym:changed");
  },
  async removeTrainer(id: string) {
    await delay();
    store.trainers = store.trainers.filter((t) => t.id !== id);
    emit("gym:changed");
  },
  async getMembers() {
    await delay();
    return store.members;
  },
  async upsertMember(input: Partial<Member> & Pick<Member, "name">) {
    await delay();
    if (input.id) {
      store.members = store.members.map((m) => (m.id === input.id ? { ...m, ...input } as Member : m));
    } else {
      store.members.push({
        id: `m${store.members.length + 1}`,
        name: input.name,
        membershipStatus: "active",
        paymentStatus: "pending",
        assignedTrainerId: input.assignedTrainerId,
        attendanceHistory: [],
      });
    }
    emit("gym:changed");
  },
  async removeMember(id: string) {
    await delay();
    store.members = store.members.filter((m) => m.id !== id);
    emit("gym:changed");
  },
};
