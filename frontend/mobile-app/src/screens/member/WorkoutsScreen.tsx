import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";
import { PillBadge } from "../../components/PillBadge";
import { useGymTheme } from "../../contexts/ThemeContext";
import { db } from "../../services/store";

const INTENSITY_COLOR: Record<string, string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#22C55E",
};

export function WorkoutsScreen() {
  const theme = useGymTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const workouts = db.workouts;

  return (
    <ScreenShell title="Workouts">
      {workouts.length === 0 ? (
        <StateView title="No workouts assigned" description="Your trainer will assign workouts to you." />
      ) : (
        <Card title="Your Workout Plans" subtitle="Tap any workout to view details & start">
          {workouts.map((workout, i) => (
            <Pressable
              key={workout.id}
              style={({ pressed }) => [
                styles.item,
                { borderColor: theme.border, borderBottomWidth: i < workouts.length - 1 ? 1 : 0 },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => navigation.navigate("WorkoutDetail", { workoutId: workout.id, workoutName: workout.name })}
            >
              <View style={[styles.icon, { backgroundColor: `${theme.accent}22` }]}>
                <Text style={{ fontSize: 18 }}>💪</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]}>{workout.name}</Text>
                <Text style={[styles.sub, { color: theme.muted }]}>
                  {workout.exercises} exercises · {workout.duration} · {workout.category}
                </Text>
              </View>
              <View style={styles.right}>
                <PillBadge
                  label={workout.intensity}
                  type={workout.intensity === "High" ? "danger" : workout.intensity === "Medium" ? "neutral" : "success"}
                />
                <Text style={[styles.arrow, { color: theme.muted }]}>›</Text>
              </View>
            </Pressable>
          ))}
        </Card>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  arrow: { fontSize: 22, fontWeight: "700" },
});
