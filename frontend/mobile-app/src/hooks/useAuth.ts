import { useRole } from "../contexts/RoleContext";

export function useAuth() {
  const { currentUser, role, loading, error, retry, devSwitchRole } = useRole();
  return { currentUser, role, loading, error, retry, devSwitchRole };
}
