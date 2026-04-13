import React from "react";
import { Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useOps } from "../../contexts/OpsContext";

export function OwnerAttendanceScreen() {
  const { attendance } = useOps();
  return (
    <ScreenShell title="Attendance Overview">
      <Card title="Attendance" subtitle="Owner visibility across slots">
        {attendance.map((record) => (
          <Text key={record.id}>{`${record.date} · ${record.slot} · ${record.member} · ${record.status}`}</Text>
        ))}
      </Card>
    </ScreenShell>
  );
}
