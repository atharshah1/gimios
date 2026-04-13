import React from "react";
import { Text } from "react-native";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";
import { useOps } from "../../contexts/OpsContext";

export function AttendanceHistoryScreen() {
  const { attendance } = useOps();
  const memberHistory = attendance.filter((record) => record.member === "Mike Ryan");

  return (
    <ScreenShell title="Attendance History">
      {memberHistory.length === 0 ? (
        <StateView title="No attendance yet" description="Attend a booked slot and history appears here." />
      ) : (
        <Card title="Profile → Attendance" subtitle="Date · Slot · Status">
          {memberHistory.map((record) => (
            <Text key={record.id}>{`${record.date} · ${record.slot} · ${record.status}`}</Text>
          ))}
        </Card>
      )}
    </ScreenShell>
  );
}
