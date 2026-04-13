import { FormEvent, useMemo, useState } from "react";

type Trainer = { id: string; name: string };
type Member = { id: string; name: string };
type Slot = { id: string; date: string; time: string; trainer: string; member: string };
type Attendance = { id: string; date: string; slot: string; status: "present" | "absent"; member: string };

export default function App() {
  const [gymName, setGymName] = useState("Apex Athletics");
  const [logoUrl, setLogoUrl] = useState("https://example.com/logo.png");
  const [themeColor, setThemeColor] = useState("#8BFF2A");

  const [trainers, setTrainers] = useState<Trainer[]>([{ id: "t1", name: "Alex Morgan" }]);
  const [members, setMembers] = useState<Member[]>([{ id: "m1", name: "Mike Ryan" }]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const [trainerName, setTrainerName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [slotDate, setSlotDate] = useState("2026-04-13");
  const [slotTime, setSlotTime] = useState("09:00");
  const [slotTrainer, setSlotTrainer] = useState("Alex Morgan");
  const [slotMember, setSlotMember] = useState("Mike Ryan");

  const monthlyRevenue = useMemo(() => attendance.filter((a) => a.status === "present").length * 1500, [attendance]);

  const addTrainer = (e: FormEvent) => {
    e.preventDefault();
    if (!trainerName.trim()) return;
    setTrainers((p) => [...p, { id: `t${p.length + 1}`, name: trainerName.trim() }]);
    setTrainerName("");
  };

  const addMember = (e: FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    setMembers((p) => [...p, { id: `m${p.length + 1}`, name: memberName.trim() }]);
    setMemberName("");
  };

  const createSlot = (e: FormEvent) => {
    e.preventDefault();
    const next = { id: `s${slots.length + 1}`, date: slotDate, time: slotTime, trainer: slotTrainer, member: slotMember };
    setSlots((p) => [...p, next]);
  };

  const markAttendance = (slot: Slot) => {
    setAttendance((p) => [
      ...p,
      { id: `a${p.length + 1}`, date: slot.date, slot: `${slot.time} - ${slot.trainer}`, status: "present", member: slot.member },
    ]);
  };

  return (
    <div className="page" style={{ ["--accent" as string]: themeColor }}>
      <header>
        <h1>Gym Owner Dashboard</h1>
        <p>{gymName} · White-label Admin</p>
      </header>

      <section className="grid two">
        <article className="card">
          <h3>Create Gym / Branding</h3>
          <input value={gymName} onChange={(e) => setGymName(e.target.value)} placeholder="Gym Name" />
          <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" />
          <input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} placeholder="Theme Color" />
          <small>Logo: {logoUrl}</small>
        </article>

        <article className="card metrics">
          <h3>Dashboard</h3>
          <div>Trainers: {trainers.length}</div>
          <div>Members: {members.length}</div>
          <div>Time Slots: {slots.length}</div>
          <div>Attendance Rows: {attendance.length}</div>
          <div>Billing (demo): ₹{monthlyRevenue.toLocaleString()}</div>
        </article>
      </section>

      <section className="grid two">
        <form className="card" onSubmit={addTrainer}>
          <h3>Add Trainers</h3>
          <input value={trainerName} onChange={(e) => setTrainerName(e.target.value)} placeholder="Trainer name" />
          <button type="submit">Add Trainer</button>
          {trainers.map((t) => <p key={t.id}>{t.name}</p>)}
        </form>

        <form className="card" onSubmit={addMember}>
          <h3>Add Members</h3>
          <input value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="Member name" />
          <button type="submit">Add Member</button>
          {members.map((m) => <p key={m.id}>{m.name}</p>)}
        </form>
      </section>

      <section className="grid two">
        <form className="card" onSubmit={createSlot}>
          <h3>Create Time Slots</h3>
          <input value={slotDate} onChange={(e) => setSlotDate(e.target.value)} placeholder="Date" />
          <input value={slotTime} onChange={(e) => setSlotTime(e.target.value)} placeholder="Time" />
          <input value={slotTrainer} onChange={(e) => setSlotTrainer(e.target.value)} placeholder="Trainer" />
          <input value={slotMember} onChange={(e) => setSlotMember(e.target.value)} placeholder="Member" />
          <button type="submit">Create Slot</button>
        </form>

        <article className="card">
          <h3>View Attendance</h3>
          {slots.map((slot) => (
            <div key={slot.id} className="row">
              <span>{slot.date} {slot.time} · {slot.member}</span>
              <button onClick={() => markAttendance(slot)}>Mark Present</button>
            </div>
          ))}
          {attendance.map((a) => <p key={a.id}>{a.date} · {a.slot} · {a.member} · {a.status}</p>)}
        </article>
      </section>
    </div>
  );
}
