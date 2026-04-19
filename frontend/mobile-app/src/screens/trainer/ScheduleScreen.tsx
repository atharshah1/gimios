import React, { useEffect, useRef, useMemo, useState } from "react";
import { Animated, View, Text, StyleSheet, Pressable } from "react-native";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";
import { useSlots } from "../../hooks/useSlots";
import { useGymTheme } from "../../contexts/ThemeContext";
import { TimeSlot } from "../../services/types";
import { TODAY } from "../../services/store";

type SessionGroup = {
  key: string;
  date: string;
  time: string;
  trainerId: string;
  trainerName: string;
  members: Array<{ slotId: string; memberId: string; memberName: string }>;
};

function groupBySession(slots: TimeSlot[]): SessionGroup[] {
  const map = new Map<string, SessionGroup>();
  const sorted = [...slots].sort((a, b) =>
    a.date !== b.date ? a.date.localeCompare(b.date) : a.time.localeCompare(b.time)
  );
  for (const s of sorted) {
    const key = `${s.date}:${s.time}:${s.trainerId}`;
    if (!map.has(key)) {
      map.set(key, { key, date: s.date, time: s.time, trainerId: s.trainerId, trainerName: s.trainerName, members: [] });
    }
    map.get(key)!.members.push({ slotId: s.id, memberId: s.memberId, memberName: s.memberName });
  }
  return Array.from(map.values());
}

function FadeSlideIn({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 350, delay, useNativeDriver: true }).start();
  }, [anim, delay]);
  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
    }}>
      {children}
    </Animated.View>
  );
}

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

export function ScheduleScreen() {
  const theme = useGymTheme();
  const { slots, loading: slotsLoading, error: slotsError, refresh: refreshSlots } = useSlots();
  const { markAttendance, attendance, error: attendanceError, refresh: refreshAttendance } = useAttendance();

  // localStatus: slotId → present|absent
  const [localStatus, setLocalStatus] = useState<Record<string, "present" | "absent">>({});
  // savedKey: slotId that just got toggled (shows "Saved ✓" briefly)
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    if (savedKey === null) return;
    const t = setTimeout(() => setSavedKey(null), 1400);
    return () => clearTimeout(t);
  }, [savedKey]);

  // Use a.time directly — no fragile string splitting
  const attendedSet = useMemo(() => {
    const s = new Set<string>();
    for (const a of attendance) {
      s.add(`${a.memberId}:${a.date}:${a.time}`);
    }
    return s;
  }, [attendance]);

  const toggle = async (
    slotId: string,
    memberId: string,
    memberName: string,
    date: string,
    time: string,
    trainerName: string,
  ) => {
    const current = localStatus[slotId] ?? (attendedSet.has(`${memberId}:${date}:${time}`) ? "present" : "absent");
    const next: "present" | "absent" = current === "absent" ? "present" : "absent";
    setLocalStatus((prev) => ({ ...prev, [slotId]: next }));
    setSavedKey(slotId);
    await markAttendance({ date, time, slot: `${time} - ${trainerName}`, memberId, memberName, status: next });
  };

  const sessions = groupBySession(slots);
  const todaySessions = sessions.filter(s => s.date === TODAY);
  const upcomingSessions = sessions.filter(s => s.date > TODAY);

  const renderSession = (session: SessionGroup, index: number) => {
    const isToday = session.date === TODAY;
    const totalMembers = session.members.length;
    const presentCount = session.members.filter(m => {
      const status = localStatus[m.slotId] ?? (attendedSet.has(`${m.memberId}:${session.date}:${session.time}`) ? "present" : "absent");
      return status === "present";
    }).length;

    return (
      <FadeSlideIn key={session.key} delay={index * 80}>
        <View style={[styles.sessionCard, { backgroundColor: theme.panel, borderColor: isToday ? theme.accent : theme.border }]}>
          {/* Session header */}
          <View style={styles.sessionHeader}>
            <View style={[styles.timeBadge, { backgroundColor: isToday ? theme.accent : `${theme.accent}22` }]}>
              <Text style={[styles.timeText, { color: isToday ? "#FFFFFF" : theme.accent }]}>{session.time}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sessionTitle, { color: theme.text }]}>
                {isToday ? "Today" : session.date} · Session {index + 1}
              </Text>
              <Text style={[styles.sessionSub, { color: theme.muted }]}>
                {session.trainerName} · {totalMembers} {totalMembers === 1 ? "member" : "members"}
              </Text>
            </View>
            <View style={[styles.progressPill, { backgroundColor: presentCount === totalMembers ? "#16A34A22" : `${theme.accent}15` }]}>
              <Text style={[styles.progressText, { color: presentCount === totalMembers ? "#4ADE80" : theme.accent }]}>
                {presentCount}/{totalMembers}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Member rows */}
          {session.members.map((m) => {
            const status = localStatus[m.slotId] ?? (attendedSet.has(`${m.memberId}:${session.date}:${session.time}`) ? "present" : "absent");
            const isPresent = status === "present";
            const justSaved = savedKey === m.slotId;
            return (
              <View key={m.slotId} style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
                  <Text style={[styles.avatarText, { color: theme.accent }]}>{m.memberName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: theme.text }]}>{m.memberName}</Text>
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
                    onPress={() => toggle(m.slotId, m.memberId, m.memberName, session.date, session.time, session.trainerName)}
                  >
                    <Text style={[styles.toggleText, { color: isPresent ? "#4ADE80" : theme.danger }]}>
                      {isPresent ? "✓ Present" : "✗ Absent"}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      </FadeSlideIn>
    );
  };

  return (
    <ScreenShell title="Schedule" onRefresh={async () => { await Promise.all([refreshSlots(), refreshAttendance()]); }}>
      {slotsLoading ? <SkeletonGroup rows={4} /> : null}
      {(slotsError || attendanceError) ? <StateView title="Error" description={slotsError || attendanceError || "Unknown error"} /> : null}

      {!slotsLoading && sessions.length === 0 ? (
        <StateView
          title="No sessions yet"
          description="The gym owner hasn't created any slots. Check back soon."
        />
      ) : null}

      {todaySessions.length > 0 ? (
        <>
          <Text style={[styles.sectionLabel, { color: theme.muted }]}>TODAY — {TODAY}</Text>
          {todaySessions.map((s, i) => renderSession(s, i))}
        </>
      ) : null}

      {upcomingSessions.length > 0 ? (
        <>
          <Text style={[styles.sectionLabel, { color: theme.muted, marginTop: todaySessions.length > 0 ? 16 : 0 }]}>UPCOMING</Text>
          {upcomingSessions.map((s, i) => renderSession(s, i))}
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  sessionCard: { borderRadius: 16, borderWidth: 1, marginBottom: 14, overflow: "hidden" },
  sessionHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  timeBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", minWidth: 64 },
  timeText: { fontSize: 16, fontWeight: "800" },
  sessionTitle: { fontSize: 14, fontWeight: "700" },
  sessionSub: { fontSize: 12, marginTop: 2 },
  progressPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  progressText: { fontSize: 13, fontWeight: "800" },
  divider: { height: 1, marginHorizontal: 16 },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "800" },
  memberName: { fontSize: 14, fontWeight: "600" },
  memberSub: { fontSize: 12, marginTop: 1 },
  toggleBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  toggleText: { fontSize: 13, fontWeight: "700" },
  savedBadge: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  savedText: { fontSize: 13, fontWeight: "700" },
});
