import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { AppButton } from "../../components/AppButton";
import { FormInput } from "../../components/FormInput";
import { gymService } from "../../services/gym";
import { useGymTheme, useThemeToggle } from "../../contexts/ThemeContext";

export function OwnerSetupScreen() {
  const theme = useGymTheme();
  const toggleDark = useThemeToggle();
  const [gymName, setGymName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [themePrimary, setThemePrimary] = useState("#8BFF2A");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    const profile = await gymService.fetchGymProfile();
    setGymName(profile.gymName);
    setLogoUrl(profile.logoUrl);
    setThemePrimary(profile.themePrimary);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onSubmit = async () => {
    if (gymName.trim().length < 3) {
      setMessage("Gym name must be at least 3 characters.");
      return;
    }
    setSaving(true);
    await gymService.saveGymProfile({ gymName: gymName.trim(), logoUrl, themePrimary });
    setMessage("✓ Gym profile saved successfully.");
    setSaving(false);
  };

  return (
    <ScreenShell title="Gym Setup" onRefresh={loadProfile}>
      <Card title="Gym Profile" subtitle="Configure your gym's branding">
        <FormInput label="Gym Name" placeholder="e.g. Apex Athletics" value={gymName} onChangeText={setGymName} />
        <FormInput label="Logo URL" placeholder="https://..." value={logoUrl} onChangeText={setLogoUrl} />
        <FormInput label="Theme Color" placeholder="#8BFF2A" value={themePrimary} onChangeText={setThemePrimary} />
        {message ? (
          <StateView
            title={message.startsWith("✓") ? "Success" : "Validation Error"}
            description={message}
          />
        ) : null}
        <AppButton title={saving ? "Saving…" : "Save Profile"} onPress={onSubmit} />
      </Card>

      <Card title="Appearance" subtitle="Customize your app experience">
        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.settingDesc, { color: theme.muted }]}>
              {theme.isDark ? "Currently using dark theme" : "Currently using light theme"}
            </Text>
          </View>
          <Switch
            value={theme.isDark}
            onValueChange={toggleDark}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  settingLabel: { fontSize: 15, fontWeight: "600" },
  settingDesc: { fontSize: 12, marginTop: 2 },
});
