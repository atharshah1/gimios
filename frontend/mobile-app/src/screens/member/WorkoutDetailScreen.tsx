import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { PillBadge } from "../../components/PillBadge";
import { useGymTheme } from "../../contexts/ThemeContext";
import { db } from "../../services/store";

type RouteT = RouteProp<RootStackParamList, "WorkoutDetail">;

const EXERCISES: Record<string, string[]> = {
  "wkt-1": ["Barbell Squat 3×12", "Bench Press 3×10", "Deadlift 3×8", "Pull-ups 3×10", "Shoulder Press 3×12", "Lunges 3×15", "Plank 3×60s", "Cable Row 3×12"],
  "wkt-2": ["Bench Press 4×8", "Incline DB Press 3×12", "Cable Fly 3×15", "Pull-ups 4×10", "Barbell Row 3×12", "Bicep Curls 3×15"],
  "wkt-3": ["Plank 4×60s", "Crunches 3×25", "Russian Twists 3×20", "Leg Raises 3×20", "Mountain Climbers 3×30s"],
  "wkt-4": ["Barbell Squat 4×10", "Leg Press 3×15", "Romanian Deadlift 3×12", "Leg Curl 3×15", "Calf Raises 4×20", "Bulgarian Split Squat 3×12", "Leg Extension 3×15"],
  "wkt-5": ["Jump Rope 3×2min", "Burpees 4×15", "High Knees 4×30s", "Box Jumps 3×12", "Battle Ropes 3×30s", "Sprint Intervals 5×20s", "Jumping Jacks 3×40", "Bear Crawl 3×20m", "Mountain Climbers 4×30s", "Jump Squats 3×15"],
  "wkt-6": ["Hip Flexor Stretch 2×60s", "Pigeon Pose 2×60s", "Cat-Cow 3×10", "Thread Needle 2×30s", "Hamstring Stretch 2×45s", "Shoulder Roll 2×20", "Neck Rolls 2×10", "Seated Twist 2×45s"],
};

export function WorkoutDetailScreen() {
  const theme = useGymTheme();
  const route = useRoute<RouteT>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { workoutId, workoutName } = route.params;

  const workout = db.workouts.find((w) => w.id === workoutId);
  const exercises = EXERCISES[workoutId] ?? [];

  if (!workout) {
    return (
      <ScreenShell title="Workout">
        <Text style={{ color: theme.muted }}>Workout not found.</Text>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={workoutName}>
      <View style={[styles.header, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={[styles.icon, { backgroundColor: `${theme.accent}22` }]}>
          <Text style={{ fontSize: 28 }}>💪</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]}>{workout.name}</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>{workout.category} · {workout.duration}</Text>
        </View>
        <PillBadge
          label={workout.intensity}
          type={workout.intensity === "High" ? "danger" : workout.intensity === "Medium" ? "neutral" : "success"}
        />
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.metaTile, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.metaValue, { color: theme.accent }]}>{workout.exercises}</Text>
          <Text style={[styles.metaLabel, { color: theme.muted }]}>Exercises</Text>
        </View>
        <View style={[styles.metaTile, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.metaValue, { color: theme.text }]}>{workout.duration}</Text>
          <Text style={[styles.metaLabel, { color: theme.muted }]}>Duration</Text>
        </View>
        <View style={[styles.metaTile, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.metaValue, { color: theme.text }]}>{workout.intensity}</Text>
          <Text style={[styles.metaLabel, { color: theme.muted }]}>Intensity</Text>
        </View>
      </View>

      <Card title="Exercises" subtitle={`${exercises.length} movements in this session`}>
        {exercises.map((ex, i) => (
          <View key={i} style={[styles.exRow, { borderColor: theme.border, borderBottomWidth: i < exercises.length - 1 ? 1 : 0 }]}>
            <View style={[styles.exNum, { backgroundColor: `${theme.accent}22` }]}>
              <Text style={[styles.exNumText, { color: theme.accent }]}>{i + 1}</Text>
            </View>
            <Text style={[styles.exName, { color: theme.text }]}>{ex}</Text>
          </View>
        ))}
      </Card>

      <AppButton
        title="▶  Start Workout"
        onPress={() => navigation.navigate("LiveWorkout", { workoutId, workoutName })}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  icon: { width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "800" },
  subtitle: { fontSize: 12, marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  metaTile: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center" },
  metaValue: { fontSize: 16, fontWeight: "800" },
  metaLabel: { fontSize: 11, marginTop: 4 },
  exRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  exNum: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  exNumText: { fontSize: 12, fontWeight: "800" },
  exName: { fontSize: 14, fontWeight: "500" },
});
