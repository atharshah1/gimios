import { NavLink } from "react-router-dom";

export function Sidebar({ items }: { items: { label: string; to: string }[] }) {
  return (
    <aside className="sidebar">
      <h2>GymOS Web</h2>
      {items.map((item) => (
        <NavLink key={item.label} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
}
