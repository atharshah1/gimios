import { useEffect } from "react";
import { subscribe } from "../events";
import { attendanceService } from "../services/attendance.service";
import { useDomainData } from "./useDomainData";

export function useAttendance() {
  const state = useDomainData(() => attendanceService.getAll(), []);
  useEffect(() => subscribe("attendance:changed", () => void state.refresh()), [state]);
  return state;
}
