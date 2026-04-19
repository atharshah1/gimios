import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { AppButton } from "../../components/AppButton";
import { FormInput } from "../../components/FormInput";
import { useRoster } from "../../hooks/useRoster";
import { useSlots } from "../../hooks/useSlots";
import { useGymTheme } from "../../contexts/ThemeContext";

export function OwnerSlotsScreen() {
  const theme = useGymTheme();
  const { slots, createSlot, loading: slotsLoading, error: slotsError, refresh: refreshSlots } = useSlots();
  const { trainers, members, loading: rosterLoading, error: rosterError, refresh: refreshRoster } = useRoster();
  const [date, setDate] = useState("2026-04-20");
  const [time, setTime] = useState("10:00");
  const [trainer, setTrainer] = useState("");
  const [member, setMember] = useState("");
  const [error, setError] = useState("");

  const onCreate = async () => {
    if (!date || !time || !trainer || !member) {
      setError("All fields are required.");
      return;
    }
    const trainerObj = trainers.find((t) => t.name.toLowerCase() === trainer.toLowerCase());
    const memberObj = members.find((m) => m.name.toLowerCase() === member.toLowerCase());
    if (!trainerObj || !memberObj) {
      setError("Trainer/member must match a name from the roster.");
      return;
    }
    setError("");
    await createSlot({ date, time, trainerId: trainerObj.id, trainerName: trainerObj.name, memberId: memberObj.id, memberName: memberObj.name });
    setDate("2026-04-20");
    setTime("");
    setTrainer("");
    setMember("");
  };

  return (
    <ScreenShell title="Time Slots" onRefresh={async () => { await Promise.all([refreshSlots(), refreshRoster()]); }}>
      <Card title="Create Slot" subtitle="Assign trainer + member to a time">
        <FormInput label="Date" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
        <FormInput label="Time" placeholder="HH:MM" value={time} onChangeText={setTime} />
        <FormInput label="Trainer Name" placeholder="e.g. Alex Morgan" value={trainer} onChangeText={setTrainer} />
        <FormInput label="Member Name" placeholder="e.g. Mike Ryan" value={member} onChangeText={setMember} />
        {error ? <StateView title="Validation Error" description={error} /> : null}
        {(slotsError || rosterError) ? <StateView title="Error" description={slotsError || rosterError || "Unknown error"} /> : null}
        <AppButton title="Create Slot" onPress={onCreate} />
      </Card>

      <Card title={`Schedule (${slots.length})`} subtitle="All created time slots">
        {(slotsLoading || rosterLoading) ? <SkeletonGroup rows={3} /> : null}
        {slots.map((slot, i) => (
          <View key={slot.id} style={[styles.slot, { borderColor: theme.border, borderBottomWidth: i < slots.length - 1 ? 1 : 0 }]}>
            <View style={[styles.timePill, { backgroundColor: `${theme.accent}22` }]}>
              <Text style={[styles.timeText, { color: theme.accent }]}>{slot.time}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.slotTitle, { color: theme.text }]}>{slot.trainerName}</Text>
              <Text style={[styles.slotSub, { color: theme.muted }]}>{slot.date} · {slot.memberName}</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  slot: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
  timePill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 58, alignItems: "center" },
  timeText: { fontSize: 14, fontWeight: "800" },
  slotTitle: { fontSize: 14, fontWeight: "600" },
  slotSub: { fontSize: 12, marginTop: 2 },
});
