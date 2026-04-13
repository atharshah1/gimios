import { db, delay } from "./store";
import { AttendanceRecord } from "./types";
import { emit } from "./events";

export const attendanceService = {
  async listAttendance() {
    await delay();
    return db.attendance;
  },
  async markAttendance(payload: Omit<AttendanceRecord, "id">) {
    await delay();
    const next = { id: `att-${db.attendance.length + 1}`, ...payload };
    db.attendance = [...db.attendance, next];
    emit("attendance:changed");
    return next;
  },
};
