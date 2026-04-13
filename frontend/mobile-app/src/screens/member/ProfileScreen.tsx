import React from "react";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useRole } from "../../contexts/RoleContext";
import { useOps } from "../../contexts/OpsContext";

export function ProfileScreen() {
  const { devSwitchRole } = useRole();
  const navigation = useNavigation<any>();
  const { slots, markAttendance } = useOps();

  return (
    <ScreenShell title="Profile">
      <Card title="Mike Ryan" subtitle="Pro Member since 2022">
        <Button title="View Attendance History" onPress={() => navigation.navigate("AttendanceHistory")} />
        {slots[0] ? (
          <Button
            title="Attend Next Slot"
            onPress={() =>
              markAttendance({
                date: slots[0].date,
                slot: `${slots[0].time} - ${slots[0].trainer}`,
                member: "Mike Ryan",
                status: "present",
              })
            }
          />
        ) : null}
        <Button title="Dev: Switch to Trainer" onPress={() => devSwitchRole("trainer")} />
        <Button title="Dev: Switch to Owner" onPress={() => devSwitchRole("gym_owner")} />
      </Card>
    </ScreenShell>
  );
}
