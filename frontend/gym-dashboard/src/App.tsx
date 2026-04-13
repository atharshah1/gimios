import { useState } from "react";
import { AppLayout } from "./layouts/AppLayout";
import { Sidebar } from "./modules/Sidebar";
import { OwnerPanel } from "./pages/OwnerPanel";
import { SuperAdminPanel } from "./pages/SuperAdminPanel";

const ownerNav = ["Dashboard", "Trainers", "Members", "Schedule", "Attendance", "Billing", "Reports", "Settings"];
const adminNav = ["Dashboard", "Gyms", "Subscriptions", "Revenue", "Users", "System Health"];

export default function App() {
  const [mode, setMode] = useState<"owner" | "super_admin">("owner");
  const [tab, setTab] = useState("Dashboard");

  const items = mode === "owner" ? ownerNav : adminNav;

  return (
    <AppLayout
      sidebar={<Sidebar items={items} current={tab} onSelect={setTab} />}
    >
      <div className="topbar">
        <button onClick={() => { setMode("owner"); setTab("Dashboard"); }}>Gym Owner View</button>
        <button onClick={() => { setMode("super_admin"); setTab("Dashboard"); }}>Super Admin View</button>
      </div>
      {mode === "owner" ? <OwnerPanel tab={tab} /> : <SuperAdminPanel tab={tab} />}
    </AppLayout>
  );
}
