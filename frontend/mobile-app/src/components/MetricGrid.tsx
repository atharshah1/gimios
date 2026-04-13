import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

type Metric = { label: string; value: string; accent?: boolean };

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  const theme = useGymTheme();
  return (
    <View style={styles.grid}>
      {metrics.map((metric) => (
        <View
          key={metric.label}
          style={[
            styles.tile,
            { backgroundColor: theme.panelSoft, borderColor: theme.border },
            metric.accent ? { borderColor: theme.accent } : null,
          ]}
        >
          <Text style={[styles.value, { color: theme.text }]}>{metric.value}</Text>
          <Text style={[styles.label, { color: theme.muted }]}>{metric.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: { width: "48%", borderWidth: 1, borderRadius: 12, padding: 10 },
  value: { fontSize: 18, fontWeight: "800" },
  label: { fontSize: 11, marginTop: 4 },
});
