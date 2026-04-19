import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { PillBadge } from "../../components/PillBadge";
import { useRole } from "../../contexts/RoleContext";
import { useGymTheme, useThemeToggle } from "../../contexts/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useSlots } from "../../hooks/useSlots";

export function TrainerProfileScreen() {
  const theme = useGymTheme();
  const toggleDark = useThemeToggle();
  const { currentUser } = useAuth();
  const { devSwitchRole } = useRole();
  const { slots } = useSlots();

  const mySlots = slots.filter((s) => s.trainerId === (currentUser?.id ?? "trainer-1"));
  const uniqueClients = new Set(mySlots.map((s) => s.memberId)).size;

  return (
    <ScreenShell title="Profile">
      <View style={[styles.header, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
          <Text style={[styles.avatarText, { color: theme.accent }]}>
            {(currentUser?.fullName ?? "T").charAt(0)}
          </Text>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{currentUser?.fullName ?? "Trainer"}</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Personal Trainer · Apex Athletics</Text>
        <PillBadge label="Pro Trainer" type="success" />
      </View>

      <Card title="Activity" subtitle="Your training overview">
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.accent }]}>{mySlots.length}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Sessions</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.text }]}>{uniqueClients}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Clients</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.text }]}>4.9★</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Rating</Text>
          </View>
        </View>
      </Card>

      <Card title="Appearance" subtitle="Customize your app experience">
        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.settingDesc, { color: theme.muted }]}>
              {theme.isDark ? "Currently dark" : "Currently light"}
            </Text>
          </View>
          <Switch
            value={theme.isDark}
            onValueChange={toggleDark}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <Card title="Gym Info" subtitle="Your current workspace">
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.muted }]}>Gym</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>Apex Athletics</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.muted }]}>Role</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>Personal Trainer</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.muted }]}>ID</Text>
          <Text style={[styles.infoValue, { color: theme.muted }]}>{currentUser?.id ?? "—"}</Text>
        </View>
      </Card>

      <Card title="Dev Tools" subtitle="Switch role for demo">
        <AppButton title="View as Member" variant="secondary" onPress={() => devSwitchRole("member")} />
        <AppButton title="View as Owner" variant="secondary" onPress={() => devSwitchRole("gym_owner")} />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { borderRadius: 16, padding: 24, alignItems: "center", gap: 8, marginBottom: 12, borderWidth: 1 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 28, fontWeight: "800" },
  name: { fontSize: 20, fontWeight: "800" },
  subtitle: { fontSize: 13 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  stat: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 12, marginTop: 4 },
  divider: { width: 1, height: 36 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  settingLabel: { fontSize: 15, fontWeight: "600" },
  settingDesc: { fontSize: 12, marginTop: 2 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: "600" },
});
