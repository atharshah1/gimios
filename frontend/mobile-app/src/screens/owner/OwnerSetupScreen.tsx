import React from "react";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";

export function OwnerSetupScreen() {
  return (
    <ScreenShell title="Gym Owner Setup">
      <Card title="Step 1" subtitle="Sign up">
        <StateView title="Owner Account" description="Create owner credentials and verify email/phone." />
      </Card>
      <Card title="Step 2" subtitle="Create Gym + Branding">
        <StateView title="Create Gym" description="Gym name, logo upload, primary/secondary theme colors." />
      </Card>
    </ScreenShell>
  );
}
