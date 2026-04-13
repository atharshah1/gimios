import { EmptyState, ErrorState, LoadingSkeleton, SectionCard } from "../components/StateViews";
import { useAnalytics } from "../hooks/useAnalytics";

export function SuperAdminPanel({ tab }: { tab: string }) {
  const { platform } = useAnalytics();

  if (platform.loading) return <LoadingSkeleton />;
  if (platform.error) return <ErrorState message={platform.error} />;
  if (!platform.data) return <EmptyState title="No platform data" />;

  const { gyms, users, mrr, growth, failures, apiHealth, activeSessions } = platform.data;

  if (tab === "Dashboard") {
    return (
      <>
        <h1>Platform Dashboard</h1>
        <div className="metric-grid">
          <article className="card"><h4>Total gyms</h4><p>{gyms.length}</p></article>
          <article className="card"><h4>Active gyms</h4><p>{gyms.filter((g) => g.status === "active").length}</p></article>
          <article className="card"><h4>Total users</h4><p>{users.length}</p></article>
          <article className="card"><h4>Monthly revenue</h4><p>₹{mrr.toLocaleString()}</p></article>
          <article className="card"><h4>Growth</h4><p>{growth}%</p></article>
        </div>
      </>
    );
  }

  if (tab === "Gyms") return <SectionCard title="Gym Management">{gyms.map((g) => <p key={g.id}>{g.name} · {g.status} · members {g.members} · trainers {g.trainers} · ₹{g.revenue}</p>)}</SectionCard>;
  if (tab === "Subscriptions") return <SectionCard title="Subscription Management">{gyms.map((g) => <p key={g.id}>{g.name} · {g.plan} · {g.status === "active" ? "Active" : "Needs action"}</p>)}</SectionCard>;
  if (tab === "Revenue") return <SectionCard title="Revenue Analytics"><p>MRR: ₹{mrr.toLocaleString()}</p><p>Payment failures: {failures}</p>{gyms.map((g) => <p key={g.id}>{g.name}: ₹{g.revenue}</p>)}</SectionCard>;
  if (tab === "Users") return <SectionCard title="User Management">{users.map((u) => <p key={u.id}>{u.name} · {u.role} · {u.gymName} · last active {u.lastActive}</p>)}</SectionCard>;
  if (tab === "System Health") return <SectionCard title="System Health"><p>API: {apiHealth}</p><p>Active sessions: {activeSessions}</p><p>Error logs (24h): {failures}</p></SectionCard>;

  return <EmptyState title="Unknown tab" />;
}
