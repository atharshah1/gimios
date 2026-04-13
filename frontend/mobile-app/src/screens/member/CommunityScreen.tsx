import React from "react";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";

export function CommunityScreen() {
  return (
    <ScreenShell title="Community">
      <StateView title="Community feed" description="Share workout updates and follow challenges." />
    </ScreenShell>
  );
}
