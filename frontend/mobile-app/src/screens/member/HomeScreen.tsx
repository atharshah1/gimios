import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet, Pressable } from "react-native";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { useSlots } from "../../hooks/useSlots";
import { useAttendance } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";
import { useGymTheme } from "../../contexts/ThemeContext";
import { CompositeNavigationProp, NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MemberTabParamList, RootStackParamList } from "../../navigation/types";
import { TODAY, db } from "../../services/store";

type HomeNavProp = CompositeNavigationProp<
  NavigationProp<MemberTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

/** Returns the Mon-Sun ISO date strings for the week containing `dateStr`. */
function getWeekDates(dateStr: string): string[] {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun, 1=Mon, …
  // Sunday (0) needs -6 to reach Monday; other days need (1 - day)
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
  const navigation = useNavigation<HomeNavProp>();
  const mySlots = slots
    .filter((s) => s.memberId === (currentUser?.id ?? "member-1"))
    .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time));
  const nextSlot = mySlots.find((s) => s.date >= TODAY);

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

  const firstWorkout = db.workouts[0];

  return (
    <ScreenShell title={`Hi, ${currentUser?.fullName?.split(" ")[0] ?? "Member"} 👋`}>
      <FadeSlideIn delay={0}>
        <MetricGrid
          metrics={[
            {
              label: "Sessions",
              value: String(mySlots.length),
              accent: true,
              onPress: () => navigation.navigate("AttendanceHistory"),
            },
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
              <AppButton title="History" compact onPress={() => navigation.navigate("AttendanceHistory")} />
            </View>
          </Card>
        </FadeSlideIn>
      ) : null}

      {firstWorkout ? (
        <FadeSlideIn delay={120}>
          <Pressable
            style={({ pressed }) => [styles.workoutBanner, { backgroundColor: theme.accent }, pressed && { opacity: 0.85 }]}
            onPress={() => navigation.navigate("WorkoutDetail", { workoutId: firstWorkout.id, workoutName: firstWorkout.name })}
          >
            <View>
              <Text style={styles.workoutLabel}>TODAY'S WORKOUT</Text>
              <Text style={styles.workoutName}>{firstWorkout.name}</Text>
              <Text style={styles.workoutMeta}>{firstWorkout.exercises} exercises · {firstWorkout.duration}</Text>
            </View>
            <Text style={styles.workoutArrow}>›</Text>
          </Pressable>
        </FadeSlideIn>
      ) : null}

      <FadeSlideIn delay={200}>
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
  workoutBanner: { borderRadius: 16, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  workoutLabel: { fontSize: 10, fontWeight: "800", color: "rgba(255,255,255,0.7)", letterSpacing: 1, marginBottom: 4 },
  workoutName: { fontSize: 18, fontWeight: "800", color: "#FFFFFF" },
  workoutMeta: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  workoutArrow: { fontSize: 32, color: "#FFFFFF", fontWeight: "700" },
  bars: { flexDirection: "row", gap: 8, alignItems: "flex-end", height: 110 },
  barCol: { flex: 1, alignItems: "center", gap: 4 },
  bar: { width: "100%", borderRadius: 4 },
  dayLabel: { fontSize: 11, fontWeight: "600" },
});
