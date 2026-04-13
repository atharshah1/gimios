import { attendanceApi } from "../api";
import { emit } from "../events";
import { withApiFallback } from "./http.service";
import { delay, persistStore, store } from "./store";

export const attendanceService = {
  async getAll() {
    return withApiFallback(
      () => attendanceApi.list(),
      async () => {
        await delay();
        return store.attendance;
      },
    );
  },
  async mark(memberId: string, trainerId: string, slotId: string, status: "present" | "absent") {
    await delay();
    store.attendance.push({
      id: `a${store.attendance.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      memberId,
      trainerId,
      slotId,
      status,
    });
    persistStore();
    emit("attendance:changed");
  },
};
