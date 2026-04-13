import React from "react";
import { Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { trainerSchedule } from "../../data/mock";

export function ScheduleScreen() {
  return (
    <ScreenShell title="Schedule">
      <Card title="All Sessions" subtitle="Time-slot attendance">
        {trainerSchedule.map((slot) => (
          <Text key={slot.time}>{`${slot.time} · ${slot.title}`}</Text>
        ))}
      </Card>
    </ScreenShell>
  );
}
