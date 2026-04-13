import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function NutritionScreen() {
  return (
    <ScreenShell title="Nutrition">
      <Card title="Today" subtitle="Calories remaining 1,240">
        <MetricGrid
          metrics={[
            { label: "Protein", value: "85g" },
            { label: "Carbs", value: "120g" },
            { label: "Fats", value: "45g", accent: true },
            { label: "Water", value: "2.6L" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}
