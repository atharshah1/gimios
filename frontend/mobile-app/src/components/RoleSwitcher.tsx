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
    <View style={[styles.bar, { backgroundColor: theme.panel, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.muted }]}>DEMO</Text>
      <View style={styles.pills}>
        {ROLES.map((r) => (
          <Pressable
            key={r.value}
            style={[styles.pill, { backgroundColor: role === r.value ? theme.accent : theme.panelSoft }]}
            onPress={() => devSwitchRole(r.value)}
          >
            <Text style={[styles.pillText, { color: role === r.value ? "#FFF" : theme.muted }]}>{r.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, gap: 12 },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  pills: { flexDirection: "row", gap: 6 },
  pill: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  pillText: { fontSize: 12, fontWeight: "700" },
});
