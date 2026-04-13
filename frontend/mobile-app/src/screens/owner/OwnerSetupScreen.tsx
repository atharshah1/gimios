import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { gymService } from "../../services/gym";

export function OwnerSetupScreen() {
  const [gymName, setGymName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [themePrimary, setThemePrimary] = useState("#8BFF2A");
  const [message, setMessage] = useState("");

  useEffect(() => {
    gymService.fetchGymProfile().then((profile) => {
      setGymName(profile.gymName);
      setLogoUrl(profile.logoUrl);
      setThemePrimary(profile.themePrimary);
    });
  }, []);

  const onSubmit = async () => {
    if (gymName.trim().length < 3) {
      setMessage("Gym name must be at least 3 characters.");
      return;
    }
    await gymService.saveGymProfile({ gymName: gymName.trim(), logoUrl, themePrimary });
    setMessage("Gym profile saved.");
  };

  return (
    <ScreenShell title="Gym Owner Setup">
      <Card title="Signup → Create Gym" subtitle="Upload logo and select theme">
        <TextInput placeholder="Gym Name" value={gymName} onChangeText={setGymName} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Logo URL" value={logoUrl} onChangeText={setLogoUrl} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <TextInput placeholder="Theme Primary" value={themePrimary} onChangeText={setThemePrimary} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />
        <Button title="Save Setup" onPress={onSubmit} />
        {message ? <StateView title="Setup Status" description={message} /> : null}
      </Card>
    </ScreenShell>
  );
}
