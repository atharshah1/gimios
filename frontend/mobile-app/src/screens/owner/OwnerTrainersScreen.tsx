import React from "react";
import { Button, Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useOps } from "../../contexts/OpsContext";

export function OwnerTrainersScreen() {
  const { trainers, addTrainer } = useOps();
  return (
    <ScreenShell title="Add Trainers">
      <Card title="Trainer List" subtitle="HRMS management">
        {trainers.map((trainer) => (
          <Text key={trainer}>{trainer}</Text>
        ))}
        <Button title="Add Trainer" onPress={() => addTrainer(`Trainer ${trainers.length + 1}`)} />
      </Card>
    </ScreenShell>
  );
}
