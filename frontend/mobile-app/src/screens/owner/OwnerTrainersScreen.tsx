import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { useRoster } from "../../hooks/useRoster";

export function OwnerTrainersScreen() {
  const { trainers, addTrainer, loading, error: apiError } = useRoster();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (name.trim().length < 3) {
      setError("Trainer name must be at least 3 characters.");
      return;
    }
    setError("");
    await addTrainer(name.trim());
    setName("");
  };

  return (
    <ScreenShell title="Add Trainers">
      <Card title="Create Trainer" subtitle="Input + validation flow">
        <TextInput placeholder="Trainer full name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        {error ? <StateView title="Validation" description={error} /> : null}
        {apiError ? <StateView title="Error" description={apiError} /> : null}
        <Button title="Save Trainer" onPress={onSubmit} />
      </Card>
      <Card title="Trainer List" subtitle="HRMS management">
        {loading ? <StateView title="Loading" description="Loading trainers..." /> : null}
        {trainers.map((trainer) => (
          <Text key={trainer.id}>{trainer.name}</Text>
        ))}
      </Card>
    </ScreenShell>
  );
}
