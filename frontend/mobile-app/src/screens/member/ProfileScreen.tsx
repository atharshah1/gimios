import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { AppButton } from "../../components/AppButton";
import { PillBadge } from "../../components/PillBadge";
import { useAttendance } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";
import { useSlots } from "../../hooks/useSlots";
import { RootStackParamList } from "../../navigation/types";
import { useGymTheme, useThemeToggle } from "../../contexts/ThemeContext";

export function ProfileScreen() {
  const theme = useGymTheme();
  const toggleDark = useThemeToggle();
  const { currentUser } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { attendance } = useAttendance();
  const { slots } = useSlots();
  const memberAttendance = attendance.filter((r) => r.memberId === (currentUser?.id ?? "member-1"));
  const presentCount = memberAttendance.filter((r) => r.status === "present").length;

  return (
    <ScreenShell title="Profile">
      <View style={[styles.profileHeader, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={[styles.bigAvatar, { backgroundColor: `${theme.accent}22` }]}>
          <Text style={[styles.bigAvatarText, { color: theme.accent }]}>{(currentUser?.fullName ?? "M").charAt(0)}</Text>
        </View>
        <Text style={[styles.displayName, { color: theme.text }]}>{currentUser?.fullName ?? "Member"}</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Pro Member · Apex Athletics</Text>
        <PillBadge label="Active" type="success" />
      </View>

      <Card title="Membership Stats" subtitle="Your activity overview">
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.accent }]}>{presentCount}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Attended</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.text }]}>{slots.length}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Booked</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.text }]}>{memberAttendance.length}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Total</Text>
          </View>
        </View>
      </Card>

      <Card title="My Plan" subtitle="Apex Athletics · Monthly">
        <View style={styles.planRow}>
          <View>
            <Text style={[styles.planName, { color: theme.text }]}>Pro Membership</Text>
            <Text style={[styles.planRenew, { color: theme.muted }]}>Renews May 1, 2026</Text>
          </View>
          <PillBadge label="Active" type="success" />
        </View>
        <AppButton title="View Attendance History" onPress={() => navigation.navigate("AttendanceHistory")} variant="secondary" />
      </Card>

      <Card title="Appearance" subtitle="Customize your experience">
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileHeader: { borderRadius: 16, padding: 24, alignItems: "center", gap: 8, marginBottom: 12, borderWidth: 1 },
  bigAvatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  bigAvatarText: { fontSize: 28, fontWeight: "800" },
  displayName: { fontSize: 20, fontWeight: "800" },
  subtitle: { fontSize: 13 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  stat: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, height: 36 },
  planRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  planName: { fontSize: 15, fontWeight: "700" },
  planRenew: { fontSize: 12, marginTop: 2 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  settingLabel: { fontSize: 15, fontWeight: "600" },
  settingDesc: { fontSize: 12, marginTop: 2 },
});
