import { useEffect } from "react";
import { subscribe } from "../events";
import { authService } from "../services/auth.service";
import { useDomainData } from "./useDomainData";

export function useAuth() {
  const state = useDomainData(() => authService.getSession(), []);
  useEffect(() => subscribe("auth:changed", () => void state.refresh()), [state]);
  return state;
}
