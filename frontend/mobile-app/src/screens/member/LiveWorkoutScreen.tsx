import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { useGymTheme } from "../../contexts/ThemeContext";
import { db } from "../../services/store";

type RouteT = RouteProp<RootStackParamList, "LiveWorkout">;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function SuccessModal({ visible, onClose, workoutName, elapsed }: {
  visible: boolean;
  onClose: () => void;
  workoutName: string;
  elapsed: number;
}) {
  const theme = useGymTheme();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 180, friction: 12, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, scale, opacity]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View style={[styles.modal, { backgroundColor: theme.panel, borderColor: "#4ADE80", transform: [{ scale }] }]}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={[styles.successTitle, { color: "#4ADE80" }]}>Workout Complete!</Text>
          <Text style={[styles.successSub, { color: theme.text }]}>{workoutName}</Text>
          <Text style={[styles.successTime, { color: theme.muted }]}>Time: {formatTime(elapsed)}</Text>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <AppButton title="Done" onPress={onClose} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export function LiveWorkoutScreen() {
  const theme = useGymTheme();
  const route = useRoute<RouteT>();
  const navigation = useNavigation();
  const { workoutId, workoutName } = route.params;

  const workout = db.workouts.find((w) => w.id === workoutId);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [currentEx, setCurrentEx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const totalExercises = workout?.exercises ?? 5;

  const handleNext = () => {
    if (currentEx + 1 >= totalExercises) {
      setRunning(false);
      setShowSuccess(true);
    } else {
      setCurrentEx((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    setShowSuccess(false);
    navigation.goBack();
  };

  return (
    <ScreenShell title="Live Workout">
      <View style={[styles.timerCard, { backgroundColor: theme.panel, borderColor: theme.accent }]}>
        <Text style={[styles.timerLabel, { color: theme.muted }]}>
          {running ? "Session in Progress" : "Session Paused"}
        </Text>
        <Animated.Text style={[styles.timer, { color: theme.accent, transform: [{ scale: running ? pulseAnim : 1 }] }]}>
          {formatTime(elapsed)}
        </Animated.Text>
        <Text style={[styles.workoutName, { color: theme.text }]}>{workoutName}</Text>
      </View>

      <View style={[styles.progressCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.text }]}>Exercise {currentEx + 1} of {totalExercises}</Text>
          <Text style={[styles.progressPct, { color: theme.accent }]}>
            {Math.round(((currentEx) / totalExercises) * 100)}%
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <View style={[styles.progressFill, { backgroundColor: theme.accent, width: `${(currentEx / totalExercises) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [styles.controlBtn, { backgroundColor: theme.panel, borderColor: theme.border }, pressed && { opacity: 0.7 }]}
          onPress={() => setRunning((r) => !r)}
        >
          <Text style={[styles.controlIcon, { color: theme.accent }]}>{running ? "⏸" : "▶"}</Text>
          <Text style={[styles.controlLabel, { color: theme.muted }]}>{running ? "Pause" : "Resume"}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.controlBtn, { backgroundColor: theme.accent }, pressed && { opacity: 0.8 }]}
          onPress={handleNext}
        >
          <Text style={[styles.controlIcon, { color: "#FFFFFF" }]}>
            {currentEx + 1 >= totalExercises ? "🏁" : "→"}
          </Text>
          <Text style={[styles.controlLabel, { color: "#FFFFFF" }]}>
            {currentEx + 1 >= totalExercises ? "Finish" : "Next"}
          </Text>
        </Pressable>
      </View>

      <SuccessModal visible={showSuccess} onClose={handleFinish} workoutName={workoutName} elapsed={elapsed} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  timerCard: { borderRadius: 20, borderWidth: 1, padding: 28, alignItems: "center", marginBottom: 12, gap: 8 },
  timerLabel: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  timer: { fontSize: 56, fontWeight: "900", letterSpacing: -2 },
  workoutName: { fontSize: 15, fontWeight: "600" },
  progressCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  progressLabel: { fontSize: 14, fontWeight: "600" },
  progressPct: { fontSize: 14, fontWeight: "800" },
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  controls: { flexDirection: "row", gap: 12, marginTop: 4 },
  controlBtn: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 20, alignItems: "center", gap: 8 },
  controlIcon: { fontSize: 24 },
  controlLabel: { fontSize: 13, fontWeight: "700" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", padding: 24 },
  modal: { width: "100%", borderRadius: 24, borderWidth: 1, padding: 32, alignItems: "center", gap: 10 },
  successEmoji: { fontSize: 48 },
  successTitle: { fontSize: 24, fontWeight: "900" },
  successSub: { fontSize: 16, fontWeight: "600" },
  successTime: { fontSize: 14 },
  divider: { width: "100%", height: 1, marginVertical: 8 },
});
