import { emit } from "../events";
import type { Slot } from "../types";
import { delay, store } from "./store";

export const slotsService = {
  async getAll() {
    await delay();
    return store.slots;
  },
  async create(slot: Omit<Slot, "id">) {
    await delay();
    const conflict = store.slots.some((s) => s.date === slot.date && s.startHour === slot.startHour && s.trainerId === slot.trainerId);
    if (conflict) throw new Error("Trainer already assigned at this slot time.");
    store.slots.push({ ...slot, id: `s${store.slots.length + 1}` });
    emit("slots:changed");
  },
};
