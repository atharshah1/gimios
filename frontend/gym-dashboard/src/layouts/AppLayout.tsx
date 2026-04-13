import { ReactNode } from "react";

export function AppLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="app-shell">
      {sidebar}
      <main className="content">{children}</main>
    </div>
  );
}
