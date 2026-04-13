import React from "react";
import { Button } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";

export function WorkoutDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <ScreenShell title="Workout Detail">
      <Card title="Full Body Shred" subtitle="45 min · High intensity">
        <Button title="Start Workout" onPress={() => navigation.navigate("LiveWorkout")} />
      </Card>
    </ScreenShell>
  );
}
