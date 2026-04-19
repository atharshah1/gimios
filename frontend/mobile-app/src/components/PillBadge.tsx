import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

export function PillBadge({ label, type = "neutral" }: { label: string; type?: "success" | "danger" | "neutral" | "accent" }) {
  const theme = useGymTheme();
  const bg = type === "success" ? "#16A34A22" : type === "danger" ? "#EF444422" : type === "accent" ? `${theme.accent}22` : `${theme.muted}22`;
  const color = type === "success" ? "#4ADE80" : type === "danger" ? theme.danger : type === "accent" ? theme.accent : theme.muted;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start" },
  text: { fontSize: 11, fontWeight: "700" },
});
