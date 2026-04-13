import { db, delay } from "./store";
import { TimeSlot } from "./types";
import { emit } from "./events";

export const slotsService = {
  async listSlots() {
    await delay();
    return db.slots;
  },
  async createSlot(payload: Omit<TimeSlot, "id">) {
    await delay();
    const next = { id: `slot-${db.slots.length + 1}`, ...payload };
    db.slots = [...db.slots, next];
    emit("slots:changed");
    return next;
  },
};
