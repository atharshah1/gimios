import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { useRoster } from "../../hooks/useRoster";
import { useSlots } from "../../hooks/useSlots";

export function OwnerSlotsScreen() {
  const { slots, createSlot } = useSlots();
  const { trainers, members } = useRoster();
  const [date, setDate] = useState("2026-04-14");
  const [time, setTime] = useState("10:00");
  const [trainer, setTrainer] = useState(trainers[0] ?? "");
  const [member, setMember] = useState(members[0] ?? "");
  const [error, setError] = useState("");

  const onCreate = async () => {
    if (!date || !time || !trainer || !member) {
      setError("Date, time, trainer, and member are required.");
      return;
    }
    setError("");
    await createSlot({ date, time, trainer, member });
  };

  return (
    <ScreenShell title="Create Time Slots">
      <Card title="New Slot Form" subtitle="Owner creates slots">
        <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Time (HH:mm)" value={time} onChangeText={setTime} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Trainer" value={trainer} onChangeText={setTrainer} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Member" value={member} onChangeText={setMember} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        {error ? <StateView title="Validation" description={error} /> : null}
        <Button title="Create Slot" onPress={onCreate} />
      </Card>
      <Card title="Slots" subtitle="Trainer schedule sync target">
        {slots.map((slot) => (
          <Text key={slot.id}>{`${slot.date} ${slot.time} · ${slot.trainer} · ${slot.member}`}</Text>
        ))}
      </Card>
    </ScreenShell>
  );
}
