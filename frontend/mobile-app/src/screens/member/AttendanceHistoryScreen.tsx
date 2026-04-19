import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { ScreenShell } from "../../components/ScreenShell";
import { useAttendance } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";
import { useGymTheme } from "../../contexts/ThemeContext";

export function AttendanceHistoryScreen() {
  const theme = useGymTheme();
  const { attendance, loading, error, refresh } = useAttendance();
  const { currentUser } = useAuth();
  const memberHistory = attendance.filter((record) => record.memberId === (currentUser?.id ?? "member-1"));

  return (
    <ScreenShell title="Attendance History" onRefresh={refresh}>
      {loading ? <SkeletonGroup rows={5} /> : null}
      {error ? <StateView title="Error" description={error} /> : null}
      {!loading && !error && memberHistory.length === 0 ? (
        <StateView title="No attendance yet" description="Your session history will appear here." />
      ) : null}
      {!loading && !error && memberHistory.length > 0 ? (
        <View style={styles.timeline}>
          {memberHistory.map((record, i) => {
            const isPresent = record.status === "present";
            const isLast = i === memberHistory.length - 1;
            return (
              <View key={record.id} style={styles.item}>
                <View style={styles.lineCol}>
                  <View style={[styles.dot, { backgroundColor: isPresent ? "#4ADE80" : theme.danger }]}>
                    <Text style={styles.dotIcon}>{isPresent ? "✓" : "✗"}</Text>
                  </View>
                  {!isLast ? <View style={[styles.line, { backgroundColor: theme.border }]} /> : null}
                </View>
                <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.cardDate, { color: theme.text }]}>{record.date}</Text>
                    <Text style={[styles.status, { color: isPresent ? "#4ADE80" : theme.danger }]}>
                      {isPresent ? "Present" : "Absent"}
                    </Text>
                  </View>
                  <Text style={[styles.slot, { color: theme.muted }]}>{record.slot}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  timeline: { gap: 0 },
  item: { flexDirection: "row", gap: 12, marginBottom: 4 },
  lineCol: { alignItems: "center", width: 28 },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", zIndex: 1 },
  dotIcon: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  line: { width: 2, flex: 1, marginTop: 2, marginBottom: 2 },
  card: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 8 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  cardDate: { fontSize: 14, fontWeight: "700" },
  status: { fontSize: 13, fontWeight: "700" },
  slot: { fontSize: 12 },
});
