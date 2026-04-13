import { ReactNode } from "react";

export function LoadingSkeleton() {
  return <div className="state skeleton">Loading data…</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="state error">{message}</div>;
}

export function EmptyState({ title }: { title: string }) {
  return <div className="state empty">{title}</div>;
}

export function SectionCard({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}
