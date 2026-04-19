import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { CompositeNavigationProp, NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, TrainerTabParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { useSlots } from "../../hooks/useSlots";
import { useAuth } from "../../hooks/useAuth";
import { useGymTheme } from "../../contexts/ThemeContext";
import { TODAY } from "../../services/store";

type DashboardNavProp = CompositeNavigationProp<
  NavigationProp<TrainerTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function DashboardScreen() {
  const theme = useGymTheme();
  const navigation = useNavigation<DashboardNavProp>();
  const { currentUser } = useAuth();
  const { slots } = useSlots();
  const mySlots = slots
    .filter((s) => s.trainerId === (currentUser?.id ?? "trainer-1"))
    .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time));

  const todaySlots = mySlots.filter(s => s.date === TODAY);
  const uniqueSessionTimes = [...new Set(todaySlots.map(s => s.time))];
  const uniqueClients = new Set(mySlots.map(s => s.memberId)).size;

  const goToSession = (time: string) => {
    const sessionKey = `${TODAY}|${time}|${currentUser?.id ?? "trainer-1"}`;
    navigation.navigate("SessionDetails", { sessionKey });
  };

  return (
    <ScreenShell title="Dashboard">
      <MetricGrid
        metrics={[
          {
            label: "Today",
            value: String(uniqueSessionTimes.length),
            accent: true,
            onPress: () => navigation.navigate("Schedule"),
          },
          {
            label: "Clients",
            value: String(uniqueClients),
            onPress: () => navigation.navigate("Clients"),
          },
          {
            label: "This Week",
            value: String(mySlots.length),
            onPress: () => navigation.navigate("Schedule"),
          },
          {
            label: "Unpaid",
            value: "₹450",
            onPress: () => navigation.navigate("Billing"),
          },
        ]}
      />
      <Card title="Today's Sessions" subtitle={`${TODAY} · ${currentUser?.fullName ?? "Alex Morgan"}`}>
        {todaySlots.length === 0 ? (
          <Text style={{ color: theme.muted, fontSize: 14 }}>No sessions scheduled today.</Text>
        ) : null}
        {uniqueSessionTimes.map((time) => {
          const sessionSlots = todaySlots.filter(s => s.time === time);
          const sessionKey = `${TODAY}:${time}:${currentUser?.id ?? "trainer-1"}`;
          return (
            <Pressable
              key={sessionKey}
              style={({ pressed }) => [
                styles.slotRow,
                { borderColor: theme.border },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => goToSession(time)}
            >
              <View style={[styles.timeBadge, { backgroundColor: theme.accent }]}>
                <Text style={[styles.timeText, { color: "#FFFFFF" }]}>{time}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.memberName, { color: theme.text }]}>
                  {sessionSlots.map(s => s.memberName).join(", ")}
                </Text>
                <Text style={[styles.dateSub, { color: theme.muted }]}>
                  {sessionSlots.length} {sessionSlots.length === 1 ? "member" : "members"} · Apex Athletics
                </Text>
              </View>
              <Text style={[styles.arrow, { color: theme.accent }]}>›</Text>
            </Pressable>
          );
        })}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  slotRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  timeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 56, alignItems: "center" },
  timeText: { fontSize: 13, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  dateSub: { fontSize: 12, marginTop: 2 },
  arrow: { fontSize: 22, fontWeight: "700" },
});
