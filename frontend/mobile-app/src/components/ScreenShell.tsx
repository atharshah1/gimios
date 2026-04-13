import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

export function ScreenShell({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useGymTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  title: { fontSize: 21, fontWeight: "800", marginBottom: 12 },
});
