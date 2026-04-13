import React, { createContext, useContext, useMemo, useState } from "react";

export type TimeSlot = { id: string; date: string; time: string; trainer: string; member: string };
export type AttendanceRecord = { id: string; date: string; slot: string; status: "present" | "absent"; member: string };

type OpsContextType = {
  trainers: string[];
  members: string[];
  slots: TimeSlot[];
  attendance: AttendanceRecord[];
  addTrainer: (name: string) => void;
  addMember: (name: string) => void;
  createSlot: (slot: Omit<TimeSlot, "id">) => void;
  markAttendance: (record: Omit<AttendanceRecord, "id">) => void;
};

const OpsContext = createContext<OpsContextType>({
  trainers: [],
  members: [],
  slots: [],
  attendance: [],
  addTrainer: () => undefined,
  addMember: () => undefined,
  createSlot: () => undefined,
  markAttendance: () => undefined,
});

export function OpsProvider({ children }: { children: React.ReactNode }) {
  const [trainers, setTrainers] = useState<string[]>(["Alex Morgan", "Sarah Jenkins"]);
  const [members, setMembers] = useState<string[]>(["Mike Ryan", "Emma Davis"]);
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: "slot-1", date: "2026-04-13", time: "09:00", trainer: "Sarah Jenkins", member: "Mike Ryan" },
  ]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    { id: "att-1", date: "2026-04-13", slot: "09:00 - Sarah Jenkins", status: "present", member: "Mike Ryan" },
  ]);

  const value = useMemo(
    () => ({
      trainers,
      members,
      slots,
      attendance,
      addTrainer: (name: string) => setTrainers((prev) => [...prev, name]),
      addMember: (name: string) => setMembers((prev) => [...prev, name]),
      createSlot: (slot: Omit<TimeSlot, "id">) =>
        setSlots((prev) => [...prev, { id: `slot-${prev.length + 1}`, ...slot }]),
      markAttendance: (record: Omit<AttendanceRecord, "id">) =>
        setAttendance((prev) => [...prev, { id: `att-${prev.length + 1}`, ...record }]),
    }),
    [attendance, members, slots, trainers],
  );

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps() {
  return useContext(OpsContext);
}
