import React from "react";
import { Button, Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";
import { useSlots } from "../../hooks/useSlots";

export function ScheduleScreen() {
  const { slots, loading: slotsLoading, error: slotsError, refresh: refreshSlots } = useSlots();
  const { markAttendance, error: attendanceError, refresh: refreshAttendance } = useAttendance();

  return (
    <ScreenShell title="Schedule" onRefresh={async () => { await Promise.all([refreshSlots(), refreshAttendance()]); }}>
      <Card title="All Sessions" subtitle="Slots created by Gym Owner">
        {slotsLoading ? <SkeletonGroup rows={3} /> : null}
        {slotsError ? <StateView title="Error" description={slotsError} /> : null}
        {attendanceError ? <StateView title="Error" description={attendanceError} /> : null}
        {slots.map((slot) => (
          <Text key={slot.id}>{`${slot.date} ${slot.time} · ${slot.trainerName} with ${slot.memberName}`}</Text>
        ))}
        {slots[0] ? (
          <Button
            title="Mark First Slot Present"
            onPress={() =>
              markAttendance({
                date: slots[0].date,
                slot: `${slots[0].time} - ${slots[0].trainerName}`,
                memberId: slots[0].memberId,
                memberName: slots[0].memberName,
                status: "present",
              })
            }
          />
        ) : null}
      </Card>
    </ScreenShell>
  );
}
