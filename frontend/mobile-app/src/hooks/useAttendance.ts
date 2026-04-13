import { useCallback, useEffect, useState } from "react";
import { AttendanceRecord, mobileApi } from "../services/api";

export function useAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await mobileApi.listAttendance();
    setAttendance(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      refresh();
    }, 1500);
    return () => clearInterval(timer);
  }, [refresh]);

  const markAttendance = async (record: Omit<AttendanceRecord, "id">) => {
    await mobileApi.markAttendance(record);
    await refresh();
  };

  return { attendance, loading, refresh, markAttendance };
}
