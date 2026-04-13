import React from "react";
import { Button } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function DashboardScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <ScreenShell title="Trainer Dashboard">
      <Card title="Overview" subtitle="Tuesday · 3 sessions today">
        <MetricGrid
          metrics={[
            { label: "Sessions", value: "3" },
            { label: "Clients", value: "42", accent: true },
            { label: "HR Tasks", value: "2" },
            { label: "Unpaid", value: "₹450" },
          ]}
        />
      </Card>
      <Card title="Next Session" subtitle="Sarah Jenkins · 09:00 AM">
        <Button title="Open Session" onPress={() => navigation.navigate("SessionDetails")} />
      </Card>
    </ScreenShell>
  );
}
