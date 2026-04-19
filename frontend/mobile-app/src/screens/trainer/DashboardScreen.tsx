import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { useSlots } from "../../hooks/useSlots";
import { useGymTheme } from "../../contexts/ThemeContext";
import { TODAY } from "../../services/store";

export function DashboardScreen() {
  const theme = useGymTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { slots } = useSlots();
  const mySlots = slots
    .filter((s) => s.trainerId === "trainer-1")
    .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time));

  const todaySlots = mySlots.filter(s => s.date === TODAY);
  // Unique session times for today (groups of members at same time)
  const uniqueSessionTimes = new Set(todaySlots.map(s => s.time));

  return (
    <ScreenShell title="Dashboard">
      <MetricGrid
        metrics={[
          { label: "Today", value: String(uniqueSessionTimes.size), accent: true },
          { label: "Members", value: String(new Set(mySlots.map(s => s.memberId)).size) },
          { label: "This Week", value: String(mySlots.length) },
          { label: "Unpaid", value: "₹0" },
        ]}
      />
      <Card title="Today's Sessions" subtitle={`${TODAY} · Alex Morgan`}>
        {todaySlots.length === 0 ? (
          <Text style={{ color: theme.muted, fontSize: 14 }}>No sessions scheduled today.</Text>
        ) : null}
        {todaySlots.map((slot) => (
          <View key={slot.id} style={[styles.slotRow, { borderColor: theme.border }]}>
            <View style={[styles.timeBadge, { backgroundColor: theme.accent }]}>
              <Text style={[styles.timeText, { color: "#FFFFFF" }]}>{slot.time}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.memberName, { color: theme.text }]}>{slot.memberName}</Text>
              <Text style={[styles.dateSub, { color: theme.muted }]}>Today · Apex Athletics</Text>
            </View>
            <AppButton title="Details" compact onPress={() => navigation.navigate("SessionDetails")} />
          </View>
        ))}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  slotRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1 },
  timeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 56, alignItems: "center" },
  timeText: { fontSize: 13, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  dateSub: { fontSize: 12, marginTop: 2 },
});
