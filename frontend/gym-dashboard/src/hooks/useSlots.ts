import { useEffect } from "react";
import { subscribe } from "../events";
import { slotsService } from "../services/slots.service";
import { useDomainData } from "./useDomainData";

export function useSlots() {
  const state = useDomainData(() => slotsService.getAll(), []);
  useEffect(() => subscribe("slots:changed", () => void state.refresh()), [state]);
  return state;
}
