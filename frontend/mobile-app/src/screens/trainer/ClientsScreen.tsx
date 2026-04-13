import React from "react";
import { Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";
import { trainerClients } from "../../data/mock";

export function ClientsScreen() {
  const navigation = useNavigation<any>();
  const empty = trainerClients.length === 0;

  return (
    <ScreenShell title="Clients">
      {empty ? (
        <StateView title="No clients assigned" description="Once a manager assigns members, they appear here." />
      ) : (
        <Card title="Client Directory" subtitle="Assigned users only">
          {trainerClients.map((client) => (
            <Text key={client.name}>{`${client.name} · ${client.status}`}</Text>
          ))}
          <Button title="Open Client Profile" onPress={() => navigation.navigate("ClientProfile")} />
        </Card>
      )}
    </ScreenShell>
  );
}
