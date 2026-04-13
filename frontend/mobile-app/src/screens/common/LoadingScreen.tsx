import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Skeleton } from "../../components/Skeleton";
import { useGymTheme } from "../../contexts/ThemeContext";

export function LoadingScreen() {
  const theme = useGymTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>Loading your workspace...</Text>
      <View style={styles.stack}>
        <Skeleton width="65%" height={20} />
        <Skeleton width="100%" height={84} />
        <Skeleton width="100%" height={84} />
        <Skeleton width="45%" height={14} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 16 },
  stack: { gap: 12 },
});
