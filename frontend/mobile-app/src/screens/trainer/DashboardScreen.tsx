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

export function DashboardScreen() {
  const theme = useGymTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { slots } = useSlots();
  const mySlots = slots.filter((s) => s.trainerId === "trainer-1");

  return (
    <ScreenShell title="Dashboard">
      <MetricGrid
        metrics={[
          { label: "Sessions", value: String(mySlots.length), accent: true },
          { label: "Clients", value: "4" },
          { label: "This Week", value: "12" },
          { label: "Unpaid", value: "₹0" },
        ]}
      />
      <Card title="Today's Sessions" subtitle="Alex Morgan's schedule">
        {mySlots.length === 0 ? (
          <Text style={{ color: theme.muted, fontSize: 14 }}>No sessions today.</Text>
        ) : null}
        {mySlots.map((slot) => (
          <View key={slot.id} style={[styles.slotRow, { borderColor: theme.border }]}>
            <View style={[styles.timeBadge, { backgroundColor: `${theme.accent}22` }]}>
              <Text style={[styles.timeText, { color: theme.accent }]}>{slot.time}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.memberName, { color: theme.text }]}>{slot.memberName}</Text>
              <Text style={[styles.dateSub, { color: theme.muted }]}>{slot.date}</Text>
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
  timeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  timeText: { fontSize: 14, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  dateSub: { fontSize: 12, marginTop: 2 },
});
