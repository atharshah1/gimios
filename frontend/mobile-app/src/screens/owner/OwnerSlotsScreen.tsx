import React from "react";
import { Button, Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useOps } from "../../contexts/OpsContext";

export function OwnerSlotsScreen() {
  const { slots, createSlot, trainers, members } = useOps();
  return (
    <ScreenShell title="Create Time Slots">
      <Card title="Slots" subtitle="Owner creates slots → Trainer schedule updates">
        {slots.map((slot) => (
          <Text key={slot.id}>{`${slot.date} ${slot.time} · ${slot.trainer} · ${slot.member}`}</Text>
        ))}
        <Button
          title="Create Slot"
          onPress={() =>
            createSlot({
              date: "2026-04-14",
              time: `${9 + slots.length}:00`,
              trainer: trainers[0] ?? "Alex Morgan",
              member: members[0] ?? "Mike Ryan",
            })
          }
        />
      </Card>
    </ScreenShell>
  );
}
