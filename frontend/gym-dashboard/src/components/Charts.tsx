import type { TrendPoint } from "../types";

function TinyLine({ values, labels, color, metric }: { values: number[]; labels: string[]; color: string; metric: string }) {
  const w = 280;
  const h = 180;
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => `${(i / (values.length - 1 || 1)) * w},${h - (v / max) * h}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
      {values.map((v, i) => {
        const x = (i / (values.length - 1 || 1)) * w;
        const y = h - (v / max) * h;
        return (
          <g key={`${metric}-${labels[i]}`}>
            <circle cx={x} cy={y} r="3" fill={color} />
            <title>{`${labels[i]}: ${v} ${metric}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

function ChartBlock({ title, data, pick, color, metric }: { title: string; data: TrendPoint[]; pick: (p: TrendPoint) => number; color: string; metric: string }) {
  const labels = data.map((d) => d.label);
  const values = data.map(pick);
  return (
    <div className="chart-box">
      <h4>{title}</h4>
      <TinyLine values={values} labels={labels} color={color} metric={metric} />
      <div className="chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>
    </div>
  );
}

export function TrendCharts({ data }: { data: TrendPoint[] }) {
  return (
    <div className="charts-grid">
      <ChartBlock title="Attendance trend" data={data} pick={(d) => d.attendance} color="#8BFF2A" metric="%" />
      <ChartBlock title="Revenue trend" data={data} pick={(d) => d.revenue} color="#4cc9f0" metric="₹" />
      <ChartBlock title="Member growth" data={data} pick={(d) => d.members} color="#fca311" metric="members" />
    </div>
  );
}
