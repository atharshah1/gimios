export function Sidebar({ items, current, onSelect }: { items: string[]; current: string; onSelect: (item: string) => void }) {
  return (
    <aside className="sidebar">
      <h2>GymOS Web</h2>
      {items.map((item) => (
        <button key={item} className={item === current ? "active" : ""} onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </aside>
  );
}
