import React from "react";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";

export function WorkoutDetailScreen() {
  const navigation = useNavigation<any>();
  return (
    <ScreenShell title="Workout Detail">
      <Card title="Full Body Shred" subtitle="45 min · High intensity">
        <Button title="Start Workout" onPress={() => navigation.navigate("LiveWorkout")} />
      </Card>
    </ScreenShell>
  );
}
