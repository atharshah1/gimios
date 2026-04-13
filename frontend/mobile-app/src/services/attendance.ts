import { db, delay } from "./store";
import { AttendanceRecord } from "./types";

export const attendanceService = {
  async listAttendance() {
    await delay();
    return db.attendance;
  },
  async markAttendance(payload: Omit<AttendanceRecord, "id">) {
    await delay();
    const next = { id: `att-${db.attendance.length + 1}`, ...payload };
    db.attendance = [...db.attendance, next];
    return next;
  },
};
