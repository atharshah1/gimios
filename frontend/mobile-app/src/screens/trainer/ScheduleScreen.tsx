import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";
import { useSlots } from "../../hooks/useSlots";
import { useGymTheme } from "../../contexts/ThemeContext";

export function ScheduleScreen() {
  const theme = useGymTheme();
  const { slots, loading: slotsLoading, error: slotsError, refresh: refreshSlots } = useSlots();
  const { markAttendance, attendance, error: attendanceError, refresh: refreshAttendance } = useAttendance();
  const [localStatus, setLocalStatus] = useState<Record<string, "present" | "absent">>({});

  const toggle = async (slotId: string, memberId: string, memberName: string, date: string, slotLabel: string) => {
    const current = localStatus[slotId] ?? "absent";
    const next: "present" | "absent" = current === "absent" ? "present" : "absent";
    setLocalStatus((prev) => ({ ...prev, [slotId]: next }));
    await markAttendance({ date, slot: slotLabel, memberId, memberName, status: next });
  };

  return (
    <ScreenShell title="Schedule" onRefresh={async () => { await Promise.all([refreshSlots(), refreshAttendance()]); }}>
      {slotsLoading ? <SkeletonGroup rows={4} /> : null}
      {(slotsError || attendanceError) ? <StateView title="Error" description={slotsError || attendanceError || "Unknown error"} /> : null}
      {slots.map((slot) => {
        const status = localStatus[slot.id] ?? (attendance.find((a) => a.memberId === slot.memberId && a.slot.startsWith(slot.time)) ? "present" : "absent");
        const isPresent = status === "present";
        return (
          <Card key={slot.id} title={slot.time} subtitle={`${slot.date} · ${slot.trainerName}`}>
            <View style={styles.memberRow}>
              <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
                <Text style={[styles.avatarText, { color: theme.accent }]}>{slot.memberName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.memberName, { color: theme.text }]}>{slot.memberName}</Text>
                <Text style={[styles.sub, { color: theme.muted }]}>Assigned Member</Text>
              </View>
              <Pressable
                style={[styles.toggleBtn, { backgroundColor: isPresent ? "#16A34A22" : `${theme.danger}22` }]}
                onPress={() => toggle(slot.id, slot.memberId, slot.memberName, slot.date, `${slot.time} - ${slot.trainerName}`)}
              >
                <Text style={[styles.toggleText, { color: isPresent ? "#4ADE80" : theme.danger }]}>
                  {isPresent ? "✓ Present" : "✗ Absent"}
                </Text>
              </Pressable>
            </View>
          </Card>
        );
      })}
      {!slotsLoading && slots.length === 0 ? (
        <StateView title="No slots scheduled" description="The owner hasn't created any slots yet." />
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  memberRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  sub: { fontSize: 12 },
  toggleBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  toggleText: { fontSize: 13, fontWeight: "700" },
});
