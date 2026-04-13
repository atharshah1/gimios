import { useState } from "react";
import { TrendCharts } from "../components/Charts";
import { EmptyState, ErrorState, LoadingSkeleton, SectionCard } from "../components/StateViews";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useToast } from "../components/ToastProvider";
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
import { memberSchema, paymentSchema, slotSchema, trainerSchema } from "../validation/schemas";

export function OwnerPanel({ tab }: { tab: string }) {
  const { settings, trainers, members } = useGym();
  const slots = useSlots();
  const attendance = useAttendance();
  const billing = useBilling();
  const analytics = useAnalytics();
  const toast = useToast();
  const [quickName, setQuickName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [slotTitle, setSlotTitle] = useState("New Batch");
  const [slotDate, setSlotDate] = useState(new Date().toISOString().slice(0, 10));
  const [slotHour, setSlotHour] = useState(7);
  const [slotTrainerId, setSlotTrainerId] = useState("t1");
  const [paymentAmount, setPaymentAmount] = useState(2500);
  const [formError, setFormError] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
          <Card><h4>Total Members</h4><p>{metric.totalMembers}</p></Card>
          <Card><h4>Active Trainers</h4><p>{metric.activeTrainers}</p></Card>
          <Card><h4>Today's Attendance %</h4><p>{metric.attendancePercent}%</p></Card>
          <Card><h4>Revenue (monthly)</h4><p>₹{metric.monthlyRevenue.toLocaleString()}</p></Card>
          <Card><h4>Active Subscriptions</h4><p>{metric.activeSubscriptions}</p></Card>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const result = trainerSchema.parse({ name: quickName });
            if (!result.ok) {
              setFormError(result.message);
              return;
            }
            setFormError(null);
            void gymService.upsertTrainer({ name: quickName.trim() });
            toast.push("Trainer added");
            setQuickName("");
          }}
        >
          <Input value={quickName} onChange={(e) => setQuickName(e.target.value)} placeholder="Add trainer" />
          {formError ? <p className="error-text">{formError}</p> : null}
        </form>
        {trainerRows.map((t) => <div key={t.id} className="row"><span>{t.name} · sessions {t.sessionsHandled} · attendance {t.attendanceRate}% · clients {t.activeClients}</span><Button onClick={() => void gymService.removeTrainer(t.id)}>Remove</Button></div>)}
      </SectionCard>
    );
  }

  if (tab === "Members") {
    if (members.loading) return <LoadingSkeleton />;
    if (members.error) return <ErrorState message={members.error} />;
    const memberRows = (members.data ?? []) as Member[];
    return (
      <SectionCard title="Member CRM" actions={<button onClick={() => void members.refresh()}>Refresh</button>}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const result = memberSchema.parse({ name: memberName });
            if (!result.ok) {
              setMemberError(result.message);
              return;
            }
            setMemberError(null);
            void gymService.upsertMember({ name: memberName.trim() });
            toast.push("Member added");
            setMemberName("");
          }}
        >
          <Input value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="Add member" />
          {memberError ? <p className="error-text">{memberError}</p> : null}
        </form>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const validation = slotSchema.parse({ title: slotTitle, startHour: slotHour });
            if (!validation.ok) {
              setSlotError(validation.message);
              return;
            }
            setSlotError(null);
            void (async () => {
              try {
                await slotsService.create({
                  title: slotTitle.trim(),
                  date: slotDate,
                  startHour: slotHour,
                  durationMin: 60,
                  trainerId: slotTrainerId,
                  memberIds: ((members.data ?? []) as Member[]).slice(0, 2).map((m) => m.id),
                });
                toast.push("Slot created");
              } catch (error) {
                setSlotError(error instanceof Error ? error.message : "Failed to create slot");
                toast.push(error instanceof Error ? error.message : "Failed to create slot", "error");
              }
            })();
          }}
        >
          <Input value={slotTitle} onChange={(e) => setSlotTitle(e.target.value)} placeholder="Slot title" />
          <Input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
          <Input type="number" value={slotHour} onChange={(e) => setSlotHour(Number(e.target.value))} min={0} max={23} placeholder="Start hour" />
          <select value={slotTrainerId} onChange={(e) => setSlotTrainerId(e.target.value)}>
            {((trainers.data ?? []) as Trainer[]).map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.name}</option>)}
          </select>
          <Button type="submit">Create slot</Button>
          {slotError ? <p className="error-text">{slotError}</p> : null}
        </form>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const validation = paymentSchema.parse({ amount: paymentAmount });
            if (!validation.ok) {
              setPaymentError(validation.message);
              return;
            }
            setPaymentError(null);
            void billingService.addPayment(paymentAmount, "pending");
            toast.push("Payment entry added");
          }}
        >
          <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} min={1} />
          <Button type="submit">Add pending payment</Button>
          {paymentError ? <p className="error-text">{paymentError}</p> : null}
        </form>
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
