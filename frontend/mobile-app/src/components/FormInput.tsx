import React from "react";
import { StyleSheet, Text, TextInput, View, KeyboardTypeOptions } from "react-native";
import { useGymTheme } from "../contexts/ThemeContext";

export function FormInput({ label, placeholder, value, onChangeText, keyboardType, secureTextEntry }: {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}) {
  const theme = useGymTheme();
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.panelSoft, borderColor: theme.border, color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 15 },
});
