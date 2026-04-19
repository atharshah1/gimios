import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRole } from "../contexts/RoleContext";
import { useGymTheme } from "../contexts/ThemeContext";
import { AppRole } from "../services/types";

const ROLES: { label: string; value: AppRole }[] = [
  { label: "Owner", value: "gym_owner" },
  { label: "Trainer", value: "trainer" },
  { label: "Member", value: "member" },
];

export function RoleSwitcher() {
  const theme = useGymTheme();
  const { role, isDemoMode, devSwitchRole } = useRole();
  if (!isDemoMode) return null;

  return (
    <View style={[styles.bar, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={[styles.track, { backgroundColor: theme.panel }]}>
        {ROLES.map((r) => {
          const active = role === r.value;
          return (
            <Pressable
              key={r.value}
              style={[styles.segment, active && { backgroundColor: theme.accent, shadowColor: theme.accent, shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 }]}
              onPress={() => devSwitchRole(r.value)}
            >
              <Text style={[styles.segmentText, { color: active ? "#FFFFFF" : theme.muted }]}>{r.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  track: { flexDirection: "row", borderRadius: 12, padding: 3 },
  segment: { flex: 1, borderRadius: 10, paddingVertical: 7, alignItems: "center" },
  segmentText: { fontSize: 13, fontWeight: "700" },
});
