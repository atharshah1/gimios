import React from "react";
import { Button } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";
import { useSlots } from "../../hooks/useSlots";
import { RootStackParamList } from "../../navigation/types";

export function ProfileScreen() {
  const { devSwitchRole, currentUser } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { slots, loading: slotsLoading, error: slotsError, refresh: refreshSlots } = useSlots();
  const { markAttendance, error: attendanceError, refresh: refreshAttendance } = useAttendance();

  return (
    <ScreenShell title="Profile" onRefresh={async () => { await Promise.all([refreshSlots(), refreshAttendance()]); }}>
      <Card title={currentUser?.fullName ?? "Member"} subtitle="Pro Member since 2022">
        <Button title="View Attendance History" onPress={() => navigation.navigate("AttendanceHistory")} />
        {slotsLoading ? <SkeletonGroup rows={2} /> : null}
        {slotsError ? <StateView title="Error" description={slotsError} /> : null}
        {attendanceError ? <StateView title="Error" description={attendanceError} /> : null}
        {slots[0] ? (
          <Button
            title="Attend Next Slot"
            onPress={() =>
              markAttendance({
                date: slots[0].date,
                slot: `${slots[0].time} - ${slots[0].trainerName}`,
                memberId: currentUser?.id ?? "unknown",
                memberName: currentUser?.fullName ?? "Unknown",
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
