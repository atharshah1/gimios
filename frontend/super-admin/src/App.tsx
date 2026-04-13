import { useMemo, useState } from "react";

type Gym = { id: string; name: string; status: "trial" | "active" | "suspended"; revenue: number };

export default function App() {
  const [gyms, setGyms] = useState<Gym[]>([
    { id: "g1", name: "Apex Athletics", status: "active", revenue: 15000 },
    { id: "g2", name: "FitMe Studio", status: "trial", revenue: 0 },
    { id: "g3", name: "Core Lab", status: "suspended", revenue: 7500 },
  ]);

  const totals = useMemo(() => {
    const active = gyms.filter((g) => g.status === "active").length;
    const trial = gyms.filter((g) => g.status === "trial").length;
    const revenue = gyms.reduce((sum, g) => sum + g.revenue, 0);
    return { active, trial, revenue };
  }, [gyms]);

  const activateTrial = (gymId: string) => {
    setGyms((prev) => prev.map((g) => (g.id === gymId ? { ...g, status: "trial" } : g)));
  };

  return (
    <div className="page">
      <header>
        <h1>Super Admin Dashboard</h1>
        <p>Platform control panel</p>
      </header>

      <section className="cards">
        <article className="card"><h3>Total Gyms</h3><p>{gyms.length}</p></article>
        <article className="card"><h3>Active Gyms</h3><p>{totals.active}</p></article>
        <article className="card"><h3>Trial Gyms</h3><p>{totals.trial}</p></article>
        <article className="card"><h3>Revenue</h3><p>₹{totals.revenue.toLocaleString()}</p></article>
      </section>

      <section className="card table-wrap">
        <h3>Gyms</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Status</th><th>Revenue</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {gyms.map((gym) => (
              <tr key={gym.id}>
                <td>{gym.name}</td>
                <td>{gym.status}</td>
                <td>₹{gym.revenue.toLocaleString()}</td>
                <td><button onClick={() => activateTrial(gym.id)}>Activate 15-day Trial</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
