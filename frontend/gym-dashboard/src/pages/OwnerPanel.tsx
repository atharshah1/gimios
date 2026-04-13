import { useState } from "react";
import { TrendCharts } from "../components/Charts";
import { EmptyState, ErrorState, LoadingSkeleton, SectionCard } from "../components/StateViews";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAttendance } from "../hooks/useAttendance";
import { useBilling } from "../hooks/useBilling";
import { useGym } from "../hooks/useGym";
import { useSlots } from "../hooks/useSlots";
import { attendanceService } from "../services/attendance.service";
import { billingService } from "../services/billing.service";
import { gymService } from "../services/gym.service";
import { slotsService } from "../services/slots.service";
import type { AttendanceRecord, Member, Slot, Trainer } from "../types";

export function OwnerPanel({ tab }: { tab: string }) {
  const { settings, trainers, members } = useGym();
  const slots = useSlots();
  const attendance = useAttendance();
  const billing = useBilling();
  const analytics = useAnalytics();
  const [quickName, setQuickName] = useState("");

  if (settings.loading) return <LoadingSkeleton />;
  if (settings.error) return <ErrorState message={settings.error} />;

  if (tab === "Dashboard") {
    if (analytics.metrics.loading || analytics.trends.loading) return <LoadingSkeleton />;
    if (analytics.metrics.error || analytics.trends.error) return <ErrorState message={analytics.metrics.error ?? analytics.trends.error ?? "Error"} />;
    if (!analytics.metrics.data || !analytics.trends.data) return <EmptyState title="No metrics yet" />;
    const metric = analytics.metrics.data;
    return (
      <>
        <h1>{settings.data?.gymName} · Owner Dashboard</h1>
        <div className="metric-grid">
          <article className="card"><h4>Total Members</h4><p>{metric.totalMembers}</p></article>
          <article className="card"><h4>Active Trainers</h4><p>{metric.activeTrainers}</p></article>
          <article className="card"><h4>Today's Attendance %</h4><p>{metric.attendancePercent}%</p></article>
          <article className="card"><h4>Revenue (monthly)</h4><p>₹{metric.monthlyRevenue.toLocaleString()}</p></article>
          <article className="card"><h4>Active Subscriptions</h4><p>{metric.activeSubscriptions}</p></article>
        </div>
        <TrendCharts data={analytics.trends.data} />
      </>
    );
  }

  if (tab === "Trainers") {
    if (trainers.loading) return <LoadingSkeleton />;
    if (trainers.error) return <ErrorState message={trainers.error} />;
    const trainerRows = (trainers.data ?? []) as Trainer[];
    return (
      <SectionCard title="Trainer Management" actions={<button onClick={() => void trainers.refresh()}>Refresh</button>}>
        <form onSubmit={(e) => { e.preventDefault(); if (!quickName.trim()) return; void gymService.upsertTrainer({ name: quickName }); setQuickName(""); }}>
          <input value={quickName} onChange={(e) => setQuickName(e.target.value)} placeholder="Add trainer" />
        </form>
        {trainerRows.map((t) => <div key={t.id} className="row"><span>{t.name} · sessions {t.sessionsHandled} · attendance {t.attendanceRate}% · clients {t.activeClients}</span><button onClick={() => void gymService.removeTrainer(t.id)}>Remove</button></div>)}
      </SectionCard>
    );
  }

  if (tab === "Members") {
    if (members.loading) return <LoadingSkeleton />;
    if (members.error) return <ErrorState message={members.error} />;
    const memberRows = (members.data ?? []) as Member[];
    return (
      <SectionCard title="Member CRM" actions={<button onClick={() => void members.refresh()}>Refresh</button>}>
        {memberRows.map((m) => <div key={m.id} className="row"><span>{m.name} · {m.membershipStatus} · payment {m.paymentStatus} · history {m.attendanceHistory.length}</span><button onClick={() => void gymService.removeMember(m.id)}>Remove</button></div>)}
      </SectionCard>
    );
  }

  if (tab === "Schedule") {
    if (slots.loading || trainers.loading || members.loading) return <LoadingSkeleton />;
    if (!slots.data) return <EmptyState title="No slots" />;
    const slotData = (slots.data ?? []) as Slot[];
    return (
      <SectionCard title="Schedule & Calendar" actions={<button onClick={() => void slots.refresh()}>Refresh</button>}>
        <button onClick={() => void slotsService.create({ title: "New Batch", date: "2026-04-14", startHour: 7, durationMin: 60, trainerId: ((trainers.data ?? []) as Trainer[])[0]?.id ?? "t1", memberIds: ((members.data ?? []) as Member[]).slice(0, 2).map((m) => m.id) })}>Create 7AM slot</button>
        <div className="calendar-grid">
          {Array.from({ length: 16 }, (_, i) => i + 6).map((hour) => (
            <div key={hour} className="calendar-row">
              <strong>{hour}:00</strong>
              <span>{slotData.filter((s) => s.startHour === hour).map((s) => s.title).join(" | ") || "—"}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  if (tab === "Attendance") {
    if (attendance.loading || analytics.reports.loading) return <LoadingSkeleton />;
    if (!attendance.data || !analytics.reports.data) return <EmptyState title="No attendance data" />;
    const attendanceRows = attendance.data as AttendanceRecord[];
    return (
      <SectionCard title="Attendance Insights" actions={<button onClick={() => void attendance.refresh()}>Refresh</button>}>
        <button onClick={() => void attendanceService.mark("m1", "t1", "s1", "present")}>Mark sample attendance</button>
        {attendanceRows.map((a) => <div key={a.id} className="row"><span>{a.date} · member {a.memberId} · trainer {a.trainerId} · {a.status}</span></div>)}
        <p>Absentee trend: {analytics.reports.data.absenteeTrend}</p>
        <p>Peak hours: {analytics.reports.data.peakHours}</p>
      </SectionCard>
    );
  }

  if (tab === "Billing") {
    if (billing.plans.loading || billing.payments.loading) return <LoadingSkeleton />;
    if (!billing.plans.data || !billing.payments.data) return <EmptyState title="No billing data" />;
    const revenue = billing.payments.data.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    const pending = billing.payments.data.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
    return (
      <SectionCard title="Billing & Revenue" actions={<button onClick={() => void billing.payments.refresh()}>Refresh</button>}>
        <div className="row"><span>Revenue summary</span><strong>₹{revenue.toLocaleString()}</strong></div>
        <div className="row"><span>Pending payments</span><strong>₹{pending.toLocaleString()}</strong></div>
        <button onClick={() => void billingService.addPayment(2500, "pending")}>Add pending payment</button>
        {billing.plans.data.map((p) => <p key={p.id}>{p.name} · ₹{p.amount} / {p.durationDays} days</p>)}
      </SectionCard>
    );
  }

  if (tab === "Reports") {
    if (analytics.reports.loading) return <LoadingSkeleton />;
    if (!analytics.reports.data) return <EmptyState title="No reports" />;
    const items = analytics.reports.data;
    return <SectionCard title="SaaS Analytics Reports" actions={<button onClick={() => void analytics.reports.refresh()}>Refresh</button>}><p>Member retention: {items.retention}%</p><p>Churn rate: {items.churn}%</p><p>Trainer efficiency: {items.trainerEfficiency}%</p><p>Revenue per member: ₹{items.revenuePerMember}</p><p>Attendance consistency: {items.attendanceConsistency}%</p></SectionCard>;
  }

  if (tab === "Settings") {
    return (
      <SectionCard title="Settings">
        <p>Working hours: {settings.data?.workingHours}</p>
        <p>Slot duration: {settings.data?.slotDuration} min</p>
        <p>Notifications: {settings.data?.notificationsEnabled ? "Enabled" : "Disabled"}</p>
        <button onClick={() => void gymService.updateSettings({ theme: settings.data?.theme === "dark" ? "light" : "dark" })}>Toggle Theme</button>
      </SectionCard>
    );
  }

  return <EmptyState title={`No page for ${tab}`} />;
}
