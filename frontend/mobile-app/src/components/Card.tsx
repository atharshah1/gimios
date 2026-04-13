import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

export function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const theme = useGymTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}> 
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 12, marginTop: 2, marginBottom: 10 },
  body: { gap: 10 },
});
