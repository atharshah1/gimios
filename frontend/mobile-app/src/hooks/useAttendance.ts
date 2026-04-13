import { useCallback, useEffect, useState } from "react";
import { AttendanceRecord } from "../services/types";
import { attendanceService } from "../services/attendance";
import { subscribe } from "../services/events";

export function useAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.listAttendance();
      setAttendance(data);
    } catch {
      setError("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("attendance:changed", refresh);
  }, [refresh]);

  const markAttendance = async (record: Omit<AttendanceRecord, "id">) => {
    const optimistic: AttendanceRecord = { id: `temp-${Date.now()}`, ...record };
    setAttendance((prev) => [...prev, optimistic]);

    try {
      setError(null);
      const created = await attendanceService.markAttendance(record);
      setAttendance((prev) => prev.map((item) => (item.id === optimistic.id ? created : item)));
    } catch {
      setAttendance((prev) => prev.filter((item) => item.id !== optimistic.id));
      setError("Failed to mark attendance.");
    }
  };

  return { attendance, loading, error, refresh, markAttendance };
}
