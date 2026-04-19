import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppRole, SessionUser } from "../services/api";
import { authService } from "../services/auth";
import { getPersistedRole, setPersistedRole } from "../services/persistence";

type SessionState = {
  role: AppRole | null;
  gymSlug: string | null;
  currentUser: SessionUser | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
  retry: () => void;
  devSwitchRole: (role: AppRole) => Promise<void>;
};

const RoleContext = createContext<SessionState>({
  role: null,
  gymSlug: null,
  currentUser: null,
  loading: true,
  error: null,
  isDemoMode: true,
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
    authService
      .fetchSession()
      .then(async (session) => {
        const persistedRole = getPersistedRole();
        const resolvedSession = persistedRole && persistedRole !== session.role
          ? await authService.switchRole(persistedRole)
          : session;
        setRole(resolvedSession.role);
        setGymSlug(resolvedSession.gymSlug);
        setCurrentUser(resolvedSession);
        setPersistedRole(resolvedSession.role);
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
    const session = await authService.switchRole(nextRole);
    setRole(session.role);
    setGymSlug(session.gymSlug);
    setCurrentUser(session);
    setPersistedRole(session.role);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ role, gymSlug, currentUser, loading, error, isDemoMode: true, retry: load, devSwitchRole }),
    [currentUser, error, gymSlug, loading, role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
