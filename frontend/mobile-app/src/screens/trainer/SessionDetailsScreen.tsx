import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View, Text, StyleSheet, Pressable } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { StateView } from "../../components/StateView";
import { useSlots } from "../../hooks/useSlots";
import { useAttendance } from "../../hooks/useAttendance";
import { useGymTheme } from "../../contexts/ThemeContext";

type RouteT = RouteProp<RootStackParamList, "SessionDetails">;

function SavedBadge({ textColor, bgColor }: { textColor: string; bgColor: string }) {
  const scale = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }).start();
  }, [scale]);
  return (
    <Animated.View style={[styles.savedBadge, { backgroundColor: bgColor, transform: [{ scale }] }]}>
      <Text style={[styles.savedText, { color: textColor }]}>Saved ✓</Text>
    </Animated.View>
  );
}

export function SessionDetailsScreen() {
  const theme = useGymTheme();
  const route = useRoute<RouteT>();
  const { sessionKey } = route.params;
  const { slots } = useSlots();
  const { attendance, markAttendance } = useAttendance();

  const [localStatus, setLocalStatus] = useState<Record<string, "present" | "absent">>({});
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    if (savedKey === null) return;
    const t = setTimeout(() => setSavedKey(null), 1400);
    return () => clearTimeout(t);
  }, [savedKey]);

  // Parse the session key: date|time|trainerId (pipe separator avoids conflict with time's colon)
  const [date, time] = sessionKey.split("|");

  const sessionSlots = slots.filter(
    (s) => s.date === date && s.time === time
  );

  const attendedSet = useMemo(() => {
    const s = new Set<string>();
    for (const a of attendance) {
      s.add(`${a.memberId}:${a.date}:${a.time}`);
    }
    return s;
  }, [attendance]);

  const toggle = async (slotId: string, memberId: string, memberName: string, trainerName: string) => {
    const current = localStatus[slotId] ?? (attendedSet.has(`${memberId}:${date}:${time}`) ? "present" : "absent");
    const next: "present" | "absent" = current === "absent" ? "present" : "absent";
    setLocalStatus((prev) => ({ ...prev, [slotId]: next }));
    setSavedKey(slotId);
    await markAttendance({ date, time, slot: `${time} - ${trainerName}`, memberId, memberName, status: next });
  };

  const trainerName = sessionSlots[0]?.trainerName ?? "Trainer";
  const presentCount = sessionSlots.filter((s) => {
    const status = localStatus[s.id] ?? (attendedSet.has(`${s.memberId}:${date}:${time}`) ? "present" : "absent");
    return status === "present";
  }).length;

  if (sessionSlots.length === 0) {
    return (
      <ScreenShell title="Session Details">
        <StateView title="Session not found" description="This session could not be loaded." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Session Details">
      <View style={[styles.header, { backgroundColor: theme.panel, borderColor: theme.accent }]}>
        <View style={[styles.timeBadge, { backgroundColor: theme.accent }]}>
          <Text style={[styles.timeText, { color: "#FFFFFF" }]}>{time}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.trainerName, { color: theme.text }]}>{trainerName}</Text>
          <Text style={[styles.dateText, { color: theme.muted }]}>{date} · Apex Athletics</Text>
        </View>
        <View style={[styles.progressPill, { backgroundColor: presentCount === sessionSlots.length ? "#16A34A22" : `${theme.accent}15` }]}>
          <Text style={[styles.progressText, { color: presentCount === sessionSlots.length ? "#4ADE80" : theme.accent }]}>
            {presentCount}/{sessionSlots.length} present
          </Text>
        </View>
      </View>

      <Card title="Attendance" subtitle="Tap to mark present or absent">
        {sessionSlots.map((s) => {
          const status = localStatus[s.id] ?? (attendedSet.has(`${s.memberId}:${date}:${time}`) ? "present" : "absent");
          const isPresent = status === "present";
          const justSaved = savedKey === s.id;
          return (
            <View key={s.id} style={styles.memberRow}>
              <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
                <Text style={[styles.avatarText, { color: theme.accent }]}>{s.memberName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.memberName, { color: theme.text }]}>{s.memberName}</Text>
                <Text style={[styles.memberSub, { color: theme.muted }]}>Member</Text>
              </View>
              {justSaved ? (
                <SavedBadge textColor="#4ADE80" bgColor="#16A34A22" />
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.toggleBtn,
                    { backgroundColor: isPresent ? "#16A34A22" : `${theme.danger}18` },
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => toggle(s.id, s.memberId, s.memberName, s.trainerName)}
                >
                  <Text style={[styles.toggleText, { color: isPresent ? "#4ADE80" : theme.danger }]}>
                    {isPresent ? "✓ Present" : "✗ Absent"}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </Card>

      {presentCount === sessionSlots.length && sessionSlots.length > 0 ? (
        <View style={[styles.completeBanner, { backgroundColor: "#16A34A22", borderColor: "#4ADE80" }]}>
          <Text style={[styles.completeText, { color: "#4ADE80" }]}>✓ All members marked present</Text>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  timeBadge: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, alignItems: "center", minWidth: 70 },
  timeText: { fontSize: 16, fontWeight: "800" },
  trainerName: { fontSize: 15, fontWeight: "700" },
  dateText: { fontSize: 12, marginTop: 2 },
  progressPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  progressText: { fontSize: 12, fontWeight: "800" },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  memberSub: { fontSize: 12, marginTop: 1 },
  toggleBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  toggleText: { fontSize: 13, fontWeight: "700" },
  savedBadge: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  savedText: { fontSize: 13, fontWeight: "700" },
  completeBanner: { borderRadius: 12, borderWidth: 1, padding: 14, alignItems: "center" },
  completeText: { fontSize: 14, fontWeight: "700" },
});
