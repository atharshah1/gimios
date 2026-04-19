import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { useSlots } from "../../hooks/useSlots";
import { useAttendance } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";
import { useGymTheme } from "../../contexts/ThemeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { TODAY } from "../../services/store";

/** Returns the Mon-Sun ISO date strings for the week containing `dateStr`. */
function getWeekDates(dateStr: string): string[] {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun, 1=Mon, …
  const diffToMon = day === 0 ? -6 : 1 - day;
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(d);
    dt.setDate(d.getDate() + diffToMon + i);
    return dt.toISOString().slice(0, 10);
  });
}

function FadeSlideIn({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 350, delay, useNativeDriver: true }).start();
  }, [anim, delay]);
  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
    }}>
      {children}
    </Animated.View>
  );
}

export function HomeScreen() {
  const theme = useGymTheme();
  const { currentUser } = useAuth();
  const { slots } = useSlots();
  const { attendance } = useAttendance();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const mySlots = slots
    .filter((s) => s.memberId === (currentUser?.id ?? "member-1"))
    .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time));
  const nextSlot = mySlots[0];

  const memberAttendance = attendance.filter(r => r.memberId === (currentUser?.id ?? "member-1"));
  const weekDates = getWeekDates(TODAY);
  // Bar height: 90=present, 24=absent/missed, 8=no session
  const activityData = weekDates.map(date => {
    const records = memberAttendance.filter(r => r.date === date);
    if (records.length === 0) return 8;
    return records.some(r => r.status === "present") ? 90 : 24;
  });
  const activityColors = activityData.map((h) =>
    h === 90 ? theme.accent : h === 24 ? theme.danger : theme.border
  );

  return (
    <ScreenShell title={`Hi, ${currentUser?.fullName?.split(" ")[0] ?? "Member"} 👋`}>
      <FadeSlideIn delay={0}>
        <MetricGrid
          metrics={[
            { label: "Sessions", value: String(mySlots.length), accent: true },
            { label: "Streak", value: "7d" },
            { label: "Calories", value: "1,240" },
            { label: "Steps", value: "8.2k" },
          ]}
        />
      </FadeSlideIn>

      {nextSlot ? (
        <FadeSlideIn delay={80}>
          <Card title="Next Session" subtitle={`${nextSlot.date} · ${nextSlot.time}`}>
            <View style={styles.sessionRow}>
              <View>
                <Text style={[styles.trainerName, { color: theme.text }]}>with {nextSlot.trainerName}</Text>
                <Text style={[styles.sessionSub, { color: theme.muted }]}>Apex Athletics</Text>
              </View>
              <AppButton title="Details" compact onPress={() => navigation.navigate("AttendanceHistory")} />
            </View>
          </Card>
        </FadeSlideIn>
      ) : null}

      <FadeSlideIn delay={160}>
        <Card title="Weekly Activity" subtitle="Your progress this week">
          <View style={styles.bars}>
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: activityData[i], backgroundColor: activityColors[i] }]} />
                <Text style={[styles.dayLabel, { color: weekDates[i] === TODAY ? theme.accent : theme.muted }]}>{day}</Text>
              </View>
            ))}
          </View>
        </Card>
      </FadeSlideIn>
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
