import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { useSlots } from "../../hooks/useSlots";
import { useAuth } from "../../hooks/useAuth";
import { useGymTheme } from "../../contexts/ThemeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";

export function HomeScreen() {
  const theme = useGymTheme();
  const { currentUser } = useAuth();
  const { slots } = useSlots();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mySlots = slots
    .filter((s) => s.memberId === (currentUser?.id ?? "member-1"))
    .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time));
  const nextSlot = mySlots[0];

  return (
    <ScreenShell title={`Hi, ${currentUser?.fullName?.split(" ")[0] ?? "Member"} 👋`}>
      <MetricGrid
        metrics={[
          { label: "Sessions", value: String(mySlots.length), accent: true },
          { label: "Streak", value: "7d" },
          { label: "Calories", value: "1,240" },
          { label: "Steps", value: "8.2k" },
        ]}
      />

      {nextSlot ? (
        <Card title="Next Session" subtitle={`${nextSlot.date} · ${nextSlot.time}`}>
          <View style={styles.sessionRow}>
            <View>
              <Text style={[styles.trainerName, { color: theme.text }]}>with {nextSlot.trainerName}</Text>
              <Text style={[styles.sessionSub, { color: theme.muted }]}>Apex Athletics</Text>
            </View>
            <AppButton title="Details" compact onPress={() => navigation.navigate("AttendanceHistory")} />
          </View>
        </Card>
      ) : null}

      <Card title="Weekly Activity" subtitle="Your progress this week">
        <View style={styles.bars}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <View key={i} style={styles.barCol}>
              <View style={[styles.bar, { height: [60, 80, 40, 100, 70, 30, 20][i], backgroundColor: i < 4 ? theme.accent : theme.border }]} />
              <Text style={[styles.dayLabel, { color: theme.muted }]}>{day}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sessionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  trainerName: { fontSize: 15, fontWeight: "700" },
  sessionSub: { fontSize: 12, marginTop: 2 },
  bars: { flexDirection: "row", gap: 8, alignItems: "flex-end", height: 110 },
  barCol: { flex: 1, alignItems: "center", gap: 4 },
  bar: { width: "100%", borderRadius: 4 },
  dayLabel: { fontSize: 11, fontWeight: "600" },
});
