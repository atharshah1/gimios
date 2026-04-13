import React from "react";
import { Button, Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useAttendance } from "../../hooks/useAttendance";
import { useSlots } from "../../hooks/useSlots";

export function ScheduleScreen() {
  const { slots } = useSlots();
  const { markAttendance } = useAttendance();

  return (
    <ScreenShell title="Schedule">
      <Card title="All Sessions" subtitle="Slots created by Gym Owner">
        {slots.map((slot) => (
          <Text key={slot.id}>{`${slot.date} ${slot.time} · ${slot.trainer} with ${slot.member}`}</Text>
        ))}
        {slots[0] ? (
          <Button
            title="Mark First Slot Present"
            onPress={() =>
              markAttendance({
                date: slots[0].date,
                slot: `${slots[0].time} - ${slots[0].trainer}`,
                member: slots[0].member,
                status: "present",
              })
            }
          />
        ) : null}
      </Card>
    </ScreenShell>
  );
}
