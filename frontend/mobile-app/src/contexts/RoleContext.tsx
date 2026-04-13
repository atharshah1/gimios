import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppRole, mobileApi, SessionUser } from "../services/api";

type SessionState = {
  role: AppRole | null;
  gymSlug: string | null;
  currentUser: SessionUser | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  devSwitchRole: (role: AppRole) => Promise<void>;
};

const RoleContext = createContext<SessionState>({
  role: null,
  gymSlug: null,
  currentUser: null,
  loading: true,
  error: null,
  retry: () => undefined,
  devSwitchRole: async () => undefined,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole | null>(null);
  const [gymSlug, setGymSlug] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    mobileApi
      .fetchSession()
      .then((session) => {
        setRole(session.role);
        setGymSlug(session.gymSlug);
        setCurrentUser(session);
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

  const devSwitchRole = async (nextRole: AppRole) => {
    setLoading(true);
    const session = await mobileApi.switchRole(nextRole);
    setRole(session.role);
    setGymSlug(session.gymSlug);
    setCurrentUser(session);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ role, gymSlug, currentUser, loading, error, retry: load, devSwitchRole }),
    [currentUser, error, gymSlug, loading, role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
