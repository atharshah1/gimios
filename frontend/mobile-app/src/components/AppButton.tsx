import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

export function AppButton({ title, onPress, variant = "primary", compact = false }: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  compact?: boolean;
}) {
  const theme = useGymTheme();
  const bg = variant === "primary" ? theme.accent : variant === "danger" ? theme.danger : "transparent";
  const borderColor = variant === "secondary" ? theme.accent : "transparent";
  const textColor = variant === "primary" ? "#FFFFFF" : variant === "danger" ? "#FFFFFF" : theme.accent;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor, borderWidth: variant === "secondary" ? 1.5 : 0, alignSelf: compact ? "flex-start" : "auto" },
        pressed && { opacity: 0.7 },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 12, paddingVertical: 13, paddingHorizontal: 20, alignItems: "center" },
  label: { fontSize: 15, fontWeight: "700" },
});
