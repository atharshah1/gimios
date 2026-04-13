import { timeslotApi } from "../api";
import { emit } from "../events";
import type { Slot } from "../types";
import { withApiFallback } from "./http.service";
import { delay, persistStore, store } from "./store";

export const slotsService = {
  async getAll() {
    return withApiFallback(
      () => timeslotApi.list(),
      async () => {
        await delay();
        return store.slots;
      },
    );
  },
  async create(slot: Omit<Slot, "id">) {
    await delay();
    const conflict = store.slots.some((s) => s.date === slot.date && s.startHour === slot.startHour && s.trainerId === slot.trainerId);
    if (conflict) throw new Error("Trainer already assigned at this slot time.");
    store.slots.push({ ...slot, id: `s${store.slots.length + 1}` });
    persistStore();
    emit("slots:changed");
  },
};
