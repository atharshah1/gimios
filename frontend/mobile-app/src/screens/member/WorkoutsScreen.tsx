import React from "react";
import { Button, Text } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";
import { workouts } from "../../data/mock";

export function WorkoutsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const offline = false;

  return (
    <ScreenShell title="Workouts">
      {offline ? <StateView title="Offline mode" description="Reconnect internet to sync latest plans." /> : null}
      <Card title="Recommended" subtitle="Your assigned workouts">
        {workouts.map((workout) => (
          <Text key={workout}>{workout}</Text>
        ))}
        <Button title="Open Workout" onPress={() => navigation.navigate("WorkoutDetail")} />
      </Card>
    </ScreenShell>
  );
}
