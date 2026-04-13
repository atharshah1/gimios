import type { TrendPoint } from "../types";

function TinyLine({ values, color }: { values: number[]; color: string }) {
  const w = 280;
  const h = 180;
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => `${(i / (values.length - 1 || 1)) * w},${h - (v / max) * h}`).join(" ");
  return <svg viewBox={`0 0 ${w} ${h}`}><polyline fill="none" stroke={color} strokeWidth="3" points={points} /></svg>;
}

export function TrendCharts({ data }: { data: TrendPoint[] }) {
  return (
    <div className="charts-grid">
      <div className="chart-box"><h4>Attendance trend</h4><TinyLine values={data.map((d) => d.attendance)} color="#8BFF2A" /></div>
      <div className="chart-box"><h4>Revenue trend</h4><TinyLine values={data.map((d) => d.revenue)} color="#4cc9f0" /></div>
      <div className="chart-box"><h4>Member growth</h4><TinyLine values={data.map((d) => d.members)} color="#fca311" /></div>
    </div>
  );
}
