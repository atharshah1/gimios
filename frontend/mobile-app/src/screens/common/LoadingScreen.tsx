import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useGymTheme } from "../../contexts/ThemeContext";

export function LoadingScreen() {
  const theme = useGymTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator color={theme.accent} size="large" />
      <Text style={[styles.text, { color: theme.text }]}>Restoring session...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  text: { fontWeight: "600" },
});
