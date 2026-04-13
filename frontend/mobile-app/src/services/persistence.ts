import { AppRole } from "./types";

const ROLE_KEY = "gymos_role";
let memoryRole: AppRole | null = null;

export function getPersistedRole(): AppRole | null {
  try {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis && globalThis.localStorage) {
      const value = globalThis.localStorage.getItem(ROLE_KEY);
      if (value === "gym_owner" || value === "trainer" || value === "member") return value;
      return null;
    }
  } catch {
    // no-op fallback below
  }
  return memoryRole;
}

export function setPersistedRole(role: AppRole) {
  try {
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis && globalThis.localStorage) {
      globalThis.localStorage.setItem(ROLE_KEY, role);
      return;
    }
  } catch {
    // no-op fallback below
  }
  memoryRole = role;
}

// NOTE:
// React Native native persistence via AsyncStorage/SecureStore is intentionally deferred.
// This adapter keeps the role persistence contract ready while avoiding new native deps now.
