import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CompositeNavigationProp, NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { AppButton } from "../../components/AppButton";
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

  const todayAttendance = attendance.filter(r => r.date === TODAY).length;

  return (
    <ScreenShell title="Dashboard" onRefresh={async () => { await Promise.all([refreshRoster(), refreshSlots(), refreshAttendance()]); }}>
      {(rosterLoading || slotsLoading || attendanceLoading) ? <SkeletonGroup rows={4} /> : null}
      {(rosterError || slotsError || attendanceError) ? <StateView title="Error" description={rosterError || slotsError || attendanceError || "Unknown error"} /> : null}

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
            value: String(todayAttendance),
            onPress: () => navigation.navigate("Attendance"),
          },
          {
            label: "Slots",
            value: String(slots.length),
            onPress: () => navigation.navigate("Slots"),
          },
        ]}
      />

      <Card title="Quick Actions" subtitle="Jump to any management section">
        <View style={styles.actions}>
          <AppButton title="＋ Add Trainer" onPress={() => navigation.navigate("Trainers")} />
          <AppButton title="＋ Add Member" onPress={() => navigation.navigate("Members")} />
          <AppButton title="＋ Create Slot" onPress={() => navigation.navigate("Slots")} />
        </View>
      </Card>

      <Card title="Recent Attendance" subtitle="All-time check-ins">
        {attendance.slice(0, 4).map(r => (
          <View key={r.id} style={[styles.row, { borderColor: theme.border }]}>
            <View>
              <Text style={[styles.rowName, { color: theme.text }]}>{r.memberName}</Text>
              <Text style={[styles.rowSub, { color: theme.muted }]}>{r.date} · {r.slot}</Text>
            </View>
            <Text style={{ color: r.status === "present" ? "#4ADE80" : theme.danger, fontWeight: "700", fontSize: 13 }}>
              {r.status === "present" ? "✓" : "✗"}
            </Text>
          </View>
        ))}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actions: { gap: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1 },
  rowName: { fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 2 },
});
