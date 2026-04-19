import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { ScreenShell } from "../../components/ScreenShell";
import { PillBadge } from "../../components/PillBadge";
import { useRoster } from "../../hooks/useRoster";
import { useSlots } from "../../hooks/useSlots";
import { useGymTheme } from "../../contexts/ThemeContext";

export function ClientsScreen() {
  const theme = useGymTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { members, loading, error, refresh } = useRoster();
  const { slots } = useSlots();

  const getLastSession = (memberId: string) => {
    const memberSlots = slots
      .filter((s) => s.memberId === memberId)
      .sort((a, b) => b.date.localeCompare(a.date));
    return memberSlots[0] ? `${memberSlots[0].date} · ${memberSlots[0].time}` : "No sessions yet";
  };

  return (
    <ScreenShell title="Clients" onRefresh={refresh}>
      {loading ? <SkeletonGroup rows={4} /> : null}
      {error ? <StateView title="Error" description={error} /> : null}
      {!loading && members.length === 0 ? (
        <StateView title="No clients assigned" description="Once an owner assigns members, they appear here." />
      ) : (
        <Card title={`Client Directory (${members.length})`} subtitle="Tap a client to view their profile">
          {members.map((member, i) => (
            <Pressable
              key={member.id}
              style={({ pressed }) => [
                styles.item,
                { borderColor: theme.border, borderBottomWidth: i < members.length - 1 ? 1 : 0 },
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => navigation.navigate("ClientProfile", { clientId: member.id, clientName: member.name })}
            >
              <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
                <Text style={[styles.avatarText, { color: theme.accent }]}>{member.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]}>{member.name}</Text>
                <Text style={[styles.sub, { color: theme.muted }]}>{getLastSession(member.id)}</Text>
              </View>
              <PillBadge label="Active" type="success" />
            </Pressable>
          ))}
        </Card>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontWeight: "800" },
  name: { fontSize: 15, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 },
});
