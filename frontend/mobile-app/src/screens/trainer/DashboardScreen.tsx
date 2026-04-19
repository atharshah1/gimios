import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { CompositeNavigationProp, NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, TrainerTabParamList } from "../../navigation/types";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
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

  // Next upcoming session (earliest time slot today, or first future slot)
  const nextTime = uniqueSessionTimes[0];
  const nextSessionSlots = nextTime ? todaySlots.filter(s => s.time === nextTime) : [];

  const goToSession = (time: string) => {
    const sessionKey = `${TODAY}|${time}|${currentUser?.id ?? "trainer-1"}`;
    navigation.navigate("SessionDetails", { sessionKey });
  };

  return (
    <ScreenShell title="Dashboard">
      {/* ── Hero: Next Up ── */}
      {nextSessionSlots.length > 0 ? (
        <Pressable
          style={({ pressed }) => [styles.hero, { backgroundColor: theme.accent }, pressed && { opacity: 0.9 }]}
          onPress={() => goToSession(nextTime)}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>NEXT UP</Text>
              <Text style={styles.heroTime}>{nextTime}</Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>{uniqueSessionTimes.length} today</Text>
            </View>
          </View>
          <Text style={styles.heroClients} numberOfLines={1}>
            {nextSessionSlots.map(s => s.memberName).join(" · ")}
          </Text>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>▶  Start Session</Text>
          </View>
        </Pressable>
      ) : (
        <View style={[styles.heroEmpty, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.heroEmptyTitle, { color: theme.text }]}>No sessions today</Text>
          <Text style={[styles.heroEmptySub, { color: theme.muted }]}>Check your schedule or add a new slot.</Text>
          <AppButton title="View Schedule" variant="secondary" compact onPress={() => navigation.navigate("Schedule")} />
        </View>
      )}

      {/* ── Stats bar ── */}
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
            label: "Upcoming",
            value: String(mySlots.filter(s => s.date > TODAY).length),
            onPress: () => navigation.navigate("Schedule"),
          },
        ]}
      />

      {/* ── Rest of today's sessions ── */}
      {uniqueSessionTimes.length > 1 ? (
        <View style={[styles.listCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.listTitle, { color: theme.text }]}>Today's Sessions</Text>
          {uniqueSessionTimes.slice(1).map((time) => {
            const sessionSlots = todaySlots.filter(s => s.time === time);
            const key = `${TODAY}|${time}|${currentUser?.id ?? "trainer-1"}`;
            return (
              <Pressable
                key={key}
                style={({ pressed }) => [
                  styles.slotRow,
                  { borderColor: theme.border },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => goToSession(time)}
              >
                <View style={[styles.timeBadge, { backgroundColor: `${theme.accent}22` }]}>
                  <Text style={[styles.timeText, { color: theme.accent }]}>{time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: theme.text }]}>
                    {sessionSlots.map(s => s.memberName).join(", ")}
                  </Text>
                  <Text style={[styles.dateSub, { color: theme.muted }]}>
                    {sessionSlots.length} {sessionSlots.length === 1 ? "member" : "members"}
                  </Text>
                </View>
                <Text style={[styles.arrow, { color: theme.accent }]}>›</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  // Hero
  hero: { borderRadius: 20, padding: 20, marginBottom: 12, gap: 6 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  heroLabel: { fontSize: 10, fontWeight: "800", color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, marginBottom: 4 },
  heroTime: { fontSize: 36, fontWeight: "900", color: "#FFFFFF", letterSpacing: -1 },
  heroPill: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  heroPillText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  heroClients: { fontSize: 15, color: "rgba(255,255,255,0.9)", fontWeight: "600" },
  heroBtn: { marginTop: 12, backgroundColor: "#FFFFFF22", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  heroBtnText: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
  // Empty hero
  heroEmpty: { borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, gap: 6, alignItems: "center" },
  heroEmptyTitle: { fontSize: 17, fontWeight: "700" },
  heroEmptySub: { fontSize: 13, textAlign: "center" },
  // List card
  listCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  listTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  slotRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  timeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 56, alignItems: "center" },
  timeText: { fontSize: 13, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  dateSub: { fontSize: 12, marginTop: 2 },
  arrow: { fontSize: 22, fontWeight: "700" },
});
