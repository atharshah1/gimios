import { useEffect } from "react";
import { subscribe } from "../events";
import { gymService } from "../services/gym.service";
import { useDomainData } from "./useDomainData";

export function useGym() {
  const settings = useDomainData(() => gymService.getSettings(), []);
  const trainers = useDomainData(() => gymService.getTrainers(), []);
  const members = useDomainData(() => gymService.getMembers(), []);
  useEffect(
    () => subscribe("gym:changed", () => {
      void settings.refresh();
      void trainers.refresh();
      void members.refresh();
    }),
    [settings, trainers, members],
  );
  return { settings, trainers, members };
}
