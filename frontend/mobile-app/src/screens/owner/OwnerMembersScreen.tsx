import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useRoster } from "../../hooks/useRoster";

export function OwnerMembersScreen() {
  const { members, addMember, loading, error: apiError, refresh } = useRoster();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (name.trim().length < 3) {
      setError("Member name must be at least 3 characters.");
      return;
    }
    setError("");
    await addMember(name.trim());
    setName("");
  };

  return (
    <ScreenShell title="Add Members" onRefresh={refresh}>
      <Card title="Create Member" subtitle="Input + validation flow">
        <TextInput placeholder="Member full name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        {error ? <StateView title="Validation" description={error} /> : null}
        {apiError ? <StateView title="Error" description={apiError} /> : null}
        <Button title="Save Member" onPress={onSubmit} />
      </Card>
      <Card title="Member List" subtitle="Member operations">
        {loading ? <SkeletonGroup rows={3} /> : null}
        {members.map((member) => (
          <Text key={member.id}>{member.name}</Text>
        ))}
      </Card>
    </ScreenShell>
  );
}
