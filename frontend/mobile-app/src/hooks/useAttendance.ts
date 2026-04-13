import { useCallback, useEffect, useState } from "react";
import { AttendanceRecord } from "../services/types";
import { attendanceService } from "../services/attendance";

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
  }, [refresh]);

  const markAttendance = async (record: Omit<AttendanceRecord, "id">) => {
    try {
      setError(null);
      await attendanceService.markAttendance(record);
      await refresh();
    } catch {
      setError("Failed to mark attendance.");
    }
  };

  return { attendance, loading, error, refresh, markAttendance };
}
