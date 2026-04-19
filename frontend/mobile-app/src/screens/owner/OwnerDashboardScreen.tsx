import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { CompositeNavigationProp, NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";
import { useRoster } from "../../hooks/useRoster";
import { useSlots } from "../../hooks/useSlots";
import { useGymTheme } from "../../contexts/ThemeContext";
import { OwnerTabParamList, RootStackParamList } from "../../navigation/types";
import { TODAY } from "../../services/store";

type OwnerNavProp = CompositeNavigationProp<
  NavigationProp<OwnerTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function OwnerDashboardScreen() {
  const theme = useGymTheme();
  const navigation = useNavigation<OwnerNavProp>();
  const { trainers, members, loading: rosterLoading, error: rosterError, refresh: refreshRoster } = useRoster();
  const { slots, loading: slotsLoading, error: slotsError, refresh: refreshSlots } = useSlots();
  const { attendance, loading: attendanceLoading, error: attendanceError, refresh: refreshAttendance } = useAttendance();

  // Decision-driven insight calculations
  const todaySlots = slots.filter(s => s.date === TODAY);
  const todayPresentIds = new Set(
    attendance.filter(r => r.date === TODAY && r.status === "present").map(r => r.memberId)
  );
  // Members with a slot today who didn't check in
  const missedToday = todaySlots
    .filter(s => !todayPresentIds.has(s.memberId))
    .map(s => s.memberName);
  const missedUnique = [...new Set(missedToday)];

  const todayPresent = todayPresentIds.size;
  const todaySlotsUnique = new Set(todaySlots.map(s => s.memberId)).size;

  // Members with no slot in the last 7 days (potential churn)
  const sevenDaysAgo = new Date(TODAY);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);
  const recentActiveIds = new Set(
    slots.filter(s => s.date >= sevenDaysAgoStr).map(s => s.memberId)
  );
  const inactiveMembers = members.filter(m => !recentActiveIds.has(m.id));

  return (
    <ScreenShell title="Dashboard" onRefresh={async () => { await Promise.all([refreshRoster(), refreshSlots(), refreshAttendance()]); }}>
      {(rosterLoading || slotsLoading || attendanceLoading) ? <SkeletonGroup rows={4} /> : null}
      {(rosterError || slotsError || attendanceError) ? (
        <StateView title="Error" description={rosterError || slotsError || attendanceError || "Unknown error"} />
      ) : null}

      {/* ── Metric Overview ── */}
      <MetricGrid
        metrics={[
          {
            label: "Members",
            value: String(members.length),
            accent: true,
            onPress: () => navigation.navigate("Members"),
          },
          {
            label: "Trainers",
            value: String(trainers.length),
            onPress: () => navigation.navigate("Trainers"),
          },
          {
            label: "Today",
            value: `${todayPresent}/${todaySlotsUnique}`,
            onPress: () => navigation.navigate("Attendance"),
          },
          {
            label: "Slots",
            value: String(slots.length),
            onPress: () => navigation.navigate("Slots"),
          },
        ]}
      />

      {/* ── Insight: missed today ── */}
      {missedUnique.length > 0 ? (
        <Pressable
          style={({ pressed }) => [
            styles.insightCard,
            { backgroundColor: `${theme.danger}12`, borderColor: theme.danger },
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => navigation.navigate("Attendance")}
        >
          <View style={styles.insightRow}>
            <Text style={[styles.insightIcon]}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.insightTitle, { color: theme.danger }]}>
                {missedUnique.length} {missedUnique.length === 1 ? "member" : "members"} missed today
              </Text>
              <Text style={[styles.insightSub, { color: theme.muted }]} numberOfLines={1}>
                {missedUnique.slice(0, 3).join(", ")}{missedUnique.length > 3 ? ` +${missedUnique.length - 3} more` : ""}
              </Text>
            </View>
            <View style={[styles.insightBtn, { borderColor: theme.danger }]}>
              <Text style={[styles.insightBtnText, { color: theme.danger }]}>Review →</Text>
            </View>
          </View>
        </Pressable>
      ) : todaySlotsUnique > 0 ? (
        <View style={[styles.insightCard, { backgroundColor: "#16A34A12", borderColor: "#4ADE80" }]}>
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>✅</Text>
            <Text style={[styles.insightTitle, { color: "#4ADE80" }]}>
              All {todaySlotsUnique} members checked in today
            </Text>
          </View>
        </View>
      ) : null}

      {/* ── Insight: inactive members ── */}
      {inactiveMembers.length > 0 ? (
        <Pressable
          style={({ pressed }) => [
            styles.insightCard,
            { backgroundColor: `${theme.accent}10`, borderColor: theme.accent },
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => navigation.navigate("Members")}
        >
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>💤</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.insightTitle, { color: theme.accent }]}>
                {inactiveMembers.length} {inactiveMembers.length === 1 ? "member" : "members"} inactive 7+ days
              </Text>
              <Text style={[styles.insightSub, { color: theme.muted }]}>
                Consider re-engaging them
              </Text>
            </View>
            <View style={[styles.insightBtn, { borderColor: theme.accent }]}>
              <Text style={[styles.insightBtnText, { color: theme.accent }]}>View →</Text>
            </View>
          </View>
        </Pressable>
      ) : null}

      {/* ── Recent Attendance ── */}
      {attendance.length > 0 ? (
        <View style={[styles.listCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.listTitle, { color: theme.text }]}>Recent Attendance</Text>
          {attendance.slice(0, 4).map((r, i) => (
            <View
              key={r.id}
              style={[styles.row, { borderColor: theme.border, borderBottomWidth: i < 3 ? 1 : 0 }]}
            >
              <View style={[styles.dot, { backgroundColor: r.status === "present" ? "#4ADE80" : theme.danger }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowName, { color: theme.text }]}>{r.memberName}</Text>
                <Text style={[styles.rowSub, { color: theme.muted }]}>{r.date} · {r.slot}</Text>
              </View>
              <Text style={{ color: r.status === "present" ? "#4ADE80" : theme.danger, fontWeight: "700", fontSize: 13 }}>
                {r.status === "present" ? "✓" : "✗"}
              </Text>
            </View>
          ))}
          <Pressable
            style={({ pressed }) => [styles.viewAllBtn, { borderColor: theme.accent }, pressed && { opacity: 0.7 }]}
            onPress={() => navigation.navigate("Attendance")}
          >
            <Text style={[styles.viewAllText, { color: theme.accent }]}>View All Attendance →</Text>
          </Pressable>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  insightCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
  insightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  insightIcon: { fontSize: 20 },
  insightTitle: { fontSize: 14, fontWeight: "700" },
  insightSub: { fontSize: 12, marginTop: 2 },
  insightBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  insightBtnText: { fontSize: 12, fontWeight: "700" },
  listCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  listTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  rowName: { fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 2 },
  viewAllBtn: { borderWidth: 1, borderRadius: 10, padding: 10, alignItems: "center", marginTop: 6 },
  viewAllText: { fontSize: 13, fontWeight: "700" },
});
