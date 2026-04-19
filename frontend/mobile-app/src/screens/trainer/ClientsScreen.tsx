import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";
import { PillBadge } from "../../components/PillBadge";
import { trainerClients } from "../../data/mock";
import { useGymTheme } from "../../contexts/ThemeContext";

export function ClientsScreen() {
  const theme = useGymTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScreenShell title="Clients">
      {trainerClients.length === 0 ? (
        <StateView title="No clients assigned" description="Once an owner assigns members, they appear here." />
      ) : (
        <Card title={`My Clients (${trainerClients.length})`} subtitle="Tap a client to view their profile">
          {trainerClients.map((client, i) => (
            <Pressable
              key={client.name}
              style={[styles.item, { borderColor: theme.border, borderBottomWidth: i < trainerClients.length - 1 ? 1 : 0 }]}
              onPress={() => navigation.navigate("ClientProfile")}
            >
              <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
                <Text style={[styles.avatarText, { color: theme.accent }]}>{client.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.text }]}>{client.name}</Text>
                <Text style={[styles.sub, { color: theme.muted }]}>Active Client</Text>
              </View>
              <PillBadge label={client.status} type={client.status === "Active" ? "success" : "danger"} />
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
