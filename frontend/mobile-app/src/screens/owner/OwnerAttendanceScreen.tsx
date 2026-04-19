import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";
import { useGymTheme } from "../../contexts/ThemeContext";
import { TODAY } from "../../services/store";

export function OwnerAttendanceScreen() {
  const theme = useGymTheme();
  const { attendance, loading, error, refresh } = useAttendance();

  const todayRecords = attendance.filter((r) => r.date === TODAY);
  const pastRecords = attendance.filter((r) => r.date < TODAY);
  const presentToday = todayRecords.filter((r) => r.status === "present").length;

  return (
    <ScreenShell title="Attendance" onRefresh={refresh}>
      {loading ? <SkeletonGroup rows={4} /> : null}
      {error ? <StateView title="Error" description={error} /> : null}

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: "#16A34A22", borderColor: "#4ADE80" }]}>
          <Text style={[styles.summaryValue, { color: "#4ADE80" }]}>{presentToday}</Text>
          <Text style={[styles.summaryLabel, { color: "#4ADE80" }]}>Present Today</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.summaryValue, { color: theme.text }]}>{todayRecords.length}</Text>
          <Text style={[styles.summaryLabel, { color: theme.muted }]}>Total Today</Text>
        </View>
      </View>

      {todayRecords.length > 0 ? (
        <Card title={`Today — ${TODAY}`} subtitle={`${presentToday}/${todayRecords.length} checked in`}>
          {todayRecords.map((record, i) => {
            const isPresent = record.status === "present";
            return (
              <View key={record.id} style={[styles.row, { borderColor: theme.border, borderBottomWidth: i < todayRecords.length - 1 ? 1 : 0 }]}>
                <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
                  <Text style={[styles.avatarText, { color: theme.accent }]}>{record.memberName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: theme.text }]}>{record.memberName}</Text>
                  <Text style={[styles.slotText, { color: theme.muted }]}>{record.slot}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: isPresent ? "#16A34A22" : `${theme.danger}18` }]}>
                  <Text style={[styles.statusText, { color: isPresent ? "#4ADE80" : theme.danger }]}>
                    {isPresent ? "✓ Present" : "✗ Absent"}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>
      ) : null}

      {pastRecords.length > 0 ? (
        <Card title="History" subtitle="Past attendance records">
          {pastRecords.slice(0, 6).map((record, i) => {
            const isPresent = record.status === "present";
            return (
              <View key={record.id} style={[styles.row, { borderColor: theme.border, borderBottomWidth: i < Math.min(6, pastRecords.length) - 1 ? 1 : 0 }]}>
                <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
                  <Text style={[styles.avatarText, { color: theme.accent }]}>{record.memberName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: theme.text }]}>{record.memberName}</Text>
                  <Text style={[styles.slotText, { color: theme.muted }]}>{record.date} · {record.slot}</Text>
                </View>
                <Text style={{ color: isPresent ? "#4ADE80" : theme.danger, fontWeight: "700", fontSize: 16 }}>
                  {isPresent ? "✓" : "✗"}
                </Text>
              </View>
            );
          })}
        </Card>
      ) : null}

      {!loading && attendance.length === 0 ? (
        <StateView title="No attendance records" description="Records will appear once sessions start." />
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  summaryCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 14, alignItems: "center" },
  summaryValue: { fontSize: 28, fontWeight: "800" },
  summaryLabel: { fontSize: 12, marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 14, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  slotText: { fontSize: 12, marginTop: 2 },
  statusPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: "700" },
});
