import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoadingSkeleton } from "./components/StateViews";
import { Button } from "./components/ui/Button";
import { useAuth } from "./hooks/useAuth";
import { AppLayout } from "./layouts/AppLayout";
import { Sidebar } from "./modules/Sidebar";
import { OwnerPanel } from "./pages/OwnerPanel";
import { SuperAdminPanel } from "./pages/SuperAdminPanel";
import { authService } from "./services/auth.service";

const ownerNav = [
  { label: "Dashboard", to: "/owner/dashboard", tab: "Dashboard" },
  { label: "Trainers", to: "/owner/trainers", tab: "Trainers" },
  { label: "Members", to: "/owner/members", tab: "Members" },
  { label: "Schedule", to: "/owner/schedule", tab: "Schedule" },
  { label: "Attendance", to: "/owner/attendance", tab: "Attendance" },
  { label: "Billing", to: "/owner/billing", tab: "Billing" },
  { label: "Reports", to: "/owner/reports", tab: "Reports" },
  { label: "Settings", to: "/owner/settings", tab: "Settings" },
];

const adminNav = [
  { label: "Dashboard", to: "/admin/dashboard", tab: "Dashboard" },
  { label: "Gyms", to: "/admin/gyms", tab: "Gyms" },
  { label: "Subscriptions", to: "/admin/subscriptions", tab: "Subscriptions" },
  { label: "Revenue", to: "/admin/revenue", tab: "Revenue" },
  { label: "Users", to: "/admin/users", tab: "Users" },
  { label: "System Health", to: "/admin/system-health", tab: "System Health" },
];

function LoginScreen() {
  return (
    <div className="content">
      <h1>Sign in</h1>
      <p>Select a role-based session.</p>
      <div className="topbar">
        <Button onClick={() => void authService.signIn("gym_owner")}>Sign in as Gym Owner</Button>
        <Button onClick={() => void authService.signIn("super_admin")}>Sign in as Super Admin</Button>
      </div>
    </div>
  );
}

function AppRoutes() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) return <LoadingSkeleton />;
  const user = auth.data;

  if (!user) return <LoginScreen />;

  const isOwner = user.role === "gym_owner";
  const nav = isOwner ? ownerNav : adminNav;
  const signOut = <Button onClick={() => void authService.signOut()}>Sign out</Button>;

  return (
    <AppLayout sidebar={<Sidebar items={nav.map(({ label, to }) => ({ label, to }))} />}>
      <div className="topbar">
        <span>Session: {user.name} ({user.role})</span>
        {signOut}
      </div>
      <Routes>
        <Route path="/" element={<Navigate to={isOwner ? "/owner/dashboard" : "/admin/dashboard"} replace />} />
        <Route path="/login" element={<LoginScreen />} />
        {ownerNav.map((item) => (
          <Route
            key={item.to}
            path={item.to}
            element={(
              <ProtectedRoute user={user} role="gym_owner">
                <OwnerPanel tab={item.tab} />
              </ProtectedRoute>
            )}
          />
        ))}
        {adminNav.map((item) => (
          <Route
            key={item.to}
            path={item.to}
            element={(
              <ProtectedRoute user={user} role="super_admin">
                <SuperAdminPanel tab={item.tab} />
              </ProtectedRoute>
            )}
          />
        ))}
        <Route path="*" element={<Navigate to={isOwner ? "/owner/dashboard" : "/admin/dashboard"} replace state={{ from: location.pathname }} />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
