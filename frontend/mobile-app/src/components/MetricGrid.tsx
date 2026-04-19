import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

type Metric = { label: string; value: string; accent?: boolean; onPress?: () => void };

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  const theme = useGymTheme();
  return (
    <View style={styles.grid}>
      {metrics.map((metric) => (
        <Pressable
          key={metric.label}
          style={({ pressed }) => [
            styles.tile,
            { backgroundColor: theme.panelSoft, borderColor: theme.border },
            metric.accent ? { borderColor: theme.accent } : null,
            metric.onPress && pressed ? { opacity: 0.7, transform: [{ scale: 0.97 }] } : null,
          ]}
          onPress={metric.onPress}
          disabled={!metric.onPress}
        >
          <Text style={[styles.value, { color: theme.text }]}>{metric.value}</Text>
          <Text style={[styles.label, { color: theme.muted }]}>{metric.label}</Text>
          {metric.onPress ? <Text style={[styles.chevron, { color: theme.muted }]}>›</Text> : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  tile: { width: "48%", borderWidth: 1, borderRadius: 12, padding: 10, position: "relative" },
  value: { fontSize: 18, fontWeight: "800" },
  label: { fontSize: 11, marginTop: 4 },
  chevron: { position: "absolute", top: 8, right: 10, fontSize: 18, fontWeight: "700" },
});
