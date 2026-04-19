import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { PillBadge } from "../../components/PillBadge";
import { AppButton } from "../../components/AppButton";
import { useSlots } from "../../hooks/useSlots";
import { useAttendance } from "../../hooks/useAttendance";
import { useGymTheme } from "../../contexts/ThemeContext";

type RouteT = RouteProp<RootStackParamList, "ClientProfile">;

export function ClientProfileScreen() {
  const theme = useGymTheme();
  const route = useRoute<RouteT>();
  const { clientId, clientName } = route.params;
  const { slots } = useSlots();
  const { attendance } = useAttendance();

  const clientSlots = slots.filter((s) => s.memberId === clientId);
  const clientAttendance = attendance.filter((r) => r.memberId === clientId);
  const presentCount = clientAttendance.filter((r) => r.status === "present").length;
  const adherence = clientSlots.length > 0
    ? Math.round((presentCount / clientSlots.length) * 100)
    : 0;

  const sortedSlots = [...clientSlots].sort((a, b) => b.date.localeCompare(a.date));
  const lastSession = sortedSlots[0];
  const nextSession = [...clientSlots]
    .sort((a, b) => a.date.localeCompare(b.date))
    .find((s) => s.date >= new Date().toISOString().slice(0, 10));

  return (
    <ScreenShell title="Client Profile">
      <View style={[styles.header, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
          <Text style={[styles.avatarText, { color: theme.accent }]}>{clientName.charAt(0)}</Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{clientName}</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Personal Training · Apex Athletics</Text>
        <PillBadge label="Active" type="success" />
      </View>

      <MetricGrid
        metrics={[
          { label: "Sessions", value: String(clientSlots.length), accent: true },
          { label: "Attended", value: String(presentCount) },
          { label: "Adherence", value: `${adherence}%` },
          { label: "Status", value: "Active" },
        ]}
      />

      <Card title="Session History" subtitle="Recent sessions">
        {clientSlots.length === 0 ? (
          <Text style={{ color: theme.muted, fontSize: 14 }}>No sessions booked yet.</Text>
        ) : null}
        {sortedSlots.slice(0, 4).map((slot) => {
          const attRecord = clientAttendance.find(
            (r) => r.date === slot.date && r.time === slot.time
          );
          const status = attRecord?.status;
          return (
            <View key={slot.id} style={[styles.sessionRow, { borderColor: theme.border }]}>
              <View style={[styles.timePill, { backgroundColor: `${theme.accent}22` }]}>
                <Text style={[styles.timeText, { color: theme.accent }]}>{slot.time}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessionDate, { color: theme.text }]}>{slot.date}</Text>
                <Text style={[styles.sessionSub, { color: theme.muted }]}>{slot.trainerName}</Text>
              </View>
              {status ? (
                <Text style={{ color: status === "present" ? "#4ADE80" : theme.danger, fontWeight: "700", fontSize: 13 }}>
                  {status === "present" ? "✓ Present" : "✗ Absent"}
                </Text>
              ) : (
                <Text style={{ color: theme.muted, fontSize: 12 }}>Upcoming</Text>
              )}
            </View>
          );
        })}
      </Card>

      {nextSession ? (
        <Card title="Next Session" subtitle="Upcoming booking">
          <View style={styles.nextRow}>
            <View>
              <Text style={[styles.nextDate, { color: theme.text }]}>{nextSession.date}</Text>
              <Text style={[styles.nextSub, { color: theme.muted }]}>{nextSession.time} · {nextSession.trainerName}</Text>
            </View>
            <PillBadge label="Confirmed" type="success" />
          </View>
        </Card>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { borderRadius: 16, padding: 20, alignItems: "center", gap: 8, marginBottom: 12, borderWidth: 1 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 24, fontWeight: "800" },
  name: { fontSize: 18, fontWeight: "800" },
  subtitle: { fontSize: 12 },
  sessionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  timePill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 52, alignItems: "center" },
  timeText: { fontSize: 13, fontWeight: "800" },
  sessionDate: { fontSize: 14, fontWeight: "600" },
  sessionSub: { fontSize: 12, marginTop: 2 },
  nextRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nextDate: { fontSize: 15, fontWeight: "700" },
  nextSub: { fontSize: 12, marginTop: 2 },
});
