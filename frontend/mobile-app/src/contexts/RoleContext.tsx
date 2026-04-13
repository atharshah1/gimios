import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppRole = "gym_owner" | "trainer" | "member";

type SessionState = {
  role: AppRole | null;
  gymSlug: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  devSwitchRole: (role: AppRole) => void;
};

const RoleContext = createContext<SessionState>({
  role: null,
  gymSlug: null,
  loading: true,
  error: null,
  retry: () => undefined,
  devSwitchRole: () => undefined,
});

function decodeMockJwt(token: string): { role: AppRole; gymSlug: string } {
  // In production this payload comes from real JWT claims returned by backend auth.
  if (token === "owner-token") return { role: "gym_owner", gymSlug: "apex-athletics" };
  if (token === "trainer-token") return { role: "trainer", gymSlug: "apex-athletics" };
  if (token === "member-token") return { role: "member", gymSlug: "fitme-studio" };
  throw new Error("Invalid session token");
}

async function bootstrapSession(): Promise<{ role: AppRole; gymSlug: string }> {
  // Placeholder async boot flow (SecureStore/AsyncStorage + refresh token) for MVP scaffold.
  const token = "owner-token";
  return decodeMockJwt(token);
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole | null>(null);
  const [gymSlug, setGymSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    bootstrapSession()
      .then((session) => {
        setRole(session.role);
        setGymSlug(session.gymSlug);
      })
      .catch(() => {
        setError("Could not restore your session. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const value = useMemo(
    () => ({ role, gymSlug, loading, error, retry: load, devSwitchRole: setRole }),
    [error, gymSlug, loading, role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
