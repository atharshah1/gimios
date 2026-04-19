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

export function OwnerTrainersScreen() {
  const theme = useGymTheme();
  const { trainers, addTrainer, loading, error: apiError, refresh } = useRoster();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }
    setError("");
    await addTrainer(name.trim());
    setName("");
  };

  return (
    <ScreenShell title="Trainers" onRefresh={refresh}>
      <Card title="Add Trainer" subtitle="Onboard a new trainer to your gym">
        <FormInput label="Full Name" placeholder="e.g. Alex Morgan" value={name} onChangeText={setName} />
        {error ? <StateView title="Validation Error" description={error} /> : null}
        {apiError ? <StateView title="Error" description={apiError} /> : null}
        <AppButton title="Save Trainer" onPress={onSubmit} />
      </Card>

      <Card title={`Trainer Roster (${trainers.length})`} subtitle="All active trainers">
        {loading ? <SkeletonGroup rows={3} /> : null}
        {trainers.map((trainer, i) => (
          <View key={trainer.id} style={[styles.item, { borderColor: theme.border, borderBottomWidth: i < trainers.length - 1 ? 1 : 0 }]}>
            <View style={[styles.avatar, { backgroundColor: `${theme.accent}22` }]}>
              <Text style={[styles.avatarText, { color: theme.accent }]}>{trainer.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>{trainer.name}</Text>
              <Text style={[styles.sub, { color: theme.muted }]}>Active Trainer</Text>
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
