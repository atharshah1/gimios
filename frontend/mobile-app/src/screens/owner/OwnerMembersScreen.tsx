import React from "react";
import { Button, Text } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useOps } from "../../contexts/OpsContext";

export function OwnerMembersScreen() {
  const { members, addMember } = useOps();
  return (
    <ScreenShell title="Add Members">
      <Card title="Member List" subtitle="Member operations">
        {members.map((member) => (
          <Text key={member}>{member}</Text>
        ))}
        <Button title="Add Member" onPress={() => addMember(`Member ${members.length + 1}`)} />
      </Card>
    </ScreenShell>
  );
}
