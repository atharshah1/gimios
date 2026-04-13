import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

export function StateView({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useGymTheme();
  return (
    <View style={[styles.wrap, { borderColor: theme.border, backgroundColor: theme.panelSoft }]}>
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
  wrap: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 8 },
  title: { fontWeight: "700", fontSize: 16 },
  desc: { fontSize: 12 },
  button: { marginTop: 6, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, alignItems: "center" },
  buttonLabel: { color: "#13210C", fontWeight: "700" },
});
