import React, { useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";
import { RoleSwitcher } from "./RoleSwitcher";

export function ScreenShell({
  title,
  children,
  onRefresh,
}: {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
}) {
  const theme = useGymTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <RoleSwitcher />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.accent} />}
      >
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 16, letterSpacing: -0.5 },
});
