import React from "react";
import { Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";

export function OwnerAttendanceScreen() {
  const { attendance, loading, error, refresh } = useAttendance();
  return (
    <ScreenShell title="Attendance Overview" onRefresh={refresh}>
      <Card title="Attendance" subtitle="Owner visibility across slots">
        {loading ? <SkeletonGroup rows={3} /> : null}
        {error ? <StateView title="Error" description={error} /> : null}
        {attendance.map((record) => (
          <Text key={record.id}>{`${record.date} · ${record.slot} · ${record.memberName} · ${record.status}`}</Text>
        ))}
      </Card>
    </ScreenShell>
  );
}
