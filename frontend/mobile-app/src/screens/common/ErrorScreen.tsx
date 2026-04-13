import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { StateView } from "../../components/StateView";
import { useGymTheme } from "../../contexts/ThemeContext";

export function ErrorScreen({ retry }: { retry: () => void }) {
  const theme = useGymTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StateView
        title="Session error"
        description="We could not load your account from the backend session."
        actionLabel="Retry"
        onAction={retry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16, justifyContent: "center" } });
