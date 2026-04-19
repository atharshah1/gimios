import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

export function StateView({
  title,
  description,
  actionLabel,
  onAction,
  emoji,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
}) {
  const theme = useGymTheme();
  const icon = emoji ?? (title.toLowerCase().includes("error") ? "⚠️" : "✦");
  return (
    <View style={[styles.wrap, { borderColor: theme.border, backgroundColor: theme.panelSoft }]}>
      <Text style={styles.emoji}>{icon}</Text>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.desc, { color: theme.muted }]}>{description}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={onAction}>
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderWidth: 1, borderRadius: 16, padding: 24, gap: 6, alignItems: "center" },
  emoji: { fontSize: 28, marginBottom: 4 },
  title: { fontWeight: "800", fontSize: 16, textAlign: "center" },
  desc: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  button: { marginTop: 12, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, alignItems: "center" },
  buttonLabel: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
