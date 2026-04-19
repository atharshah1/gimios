import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { AppButton } from "../../components/AppButton";
import { FormInput } from "../../components/FormInput";
import { PillBadge } from "../../components/PillBadge";
import { useRoster } from "../../hooks/useRoster";
import { useGymTheme } from "../../contexts/ThemeContext";

export function OwnerMembersScreen() {
  const theme = useGymTheme();
  const { members, addMember, loading, error: apiError, refresh } = useRoster();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    setError("");
    await addMember(name.trim());
    setName("");
  };

  return (
    <ScreenShell title="Members" onRefresh={refresh}>
      <Card title="Add Member" subtitle="Register a new gym member">
        <FormInput label="Full Name" placeholder="e.g. James Carter" value={name} onChangeText={setName} />
        {error ? <StateView title="Validation Error" description={error} /> : null}
        {apiError ? <StateView title="Error" description={apiError} /> : null}
        <AppButton title="Save Member" onPress={onSubmit} />
      </Card>

      <Card title={`Member Roster (${members.length})`} subtitle="All enrolled members">
        {loading ? <SkeletonGroup rows={3} /> : null}
        {members.map((member, i) => (
          <View key={member.id} style={[styles.item, { borderColor: theme.border, borderBottomWidth: i < members.length - 1 ? 1 : 0 }]}>
            <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
              <Text style={[styles.avatarText, { color: theme.accent }]}>{member.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>{member.name}</Text>
              <Text style={[styles.sub, { color: theme.muted }]}>Pro Member</Text>
            </View>
            <PillBadge label="Active" type="success" />
          </View>
        ))}
      </Card>
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
