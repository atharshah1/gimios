import { useCallback, useEffect, useState } from "react";
import { rosterService } from "../services/roster";
import { Member, Trainer } from "../services/types";
import { subscribe } from "../services/events";

export function useRoster() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [t, m] = await Promise.all([rosterService.listTrainers(), rosterService.listMembers()]);
      setTrainers(t);
      setMembers(m);
    } catch {
      setError("Failed to load roster.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("roster:changed", refresh);
  }, [refresh]);

  const addTrainer = async (name: string) => {
    const optimistic: Trainer = { id: `temp-${Date.now()}`, name };
    setTrainers((prev) => [...prev, optimistic]);

    try {
      setError(null);
      const updated = await rosterService.addTrainer(name);
      setTrainers(updated);
    } catch {
      setTrainers((prev) => prev.filter((item) => item.id !== optimistic.id));
      setError("Failed to add trainer.");
    }
  };

  const addMember = async (name: string) => {
    const optimistic: Member = { id: `temp-${Date.now()}`, name };
    setMembers((prev) => [...prev, optimistic]);

    try {
      setError(null);
      const updated = await rosterService.addMember(name);
      setMembers(updated);
    } catch {
      setMembers((prev) => prev.filter((item) => item.id !== optimistic.id));
      setError("Failed to add member.");
    }
  };

  return { trainers, members, loading, error, refresh, addTrainer, addMember };
}
