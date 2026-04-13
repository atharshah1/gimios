import { useCallback, useEffect, useState } from "react";
import { rosterService } from "../services/roster";
import { Member, Trainer } from "../services/types";

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
  }, [refresh]);

  const addTrainer = async (name: string) => {
    try {
      setError(null);
      await rosterService.addTrainer(name);
      await refresh();
    } catch {
      setError("Failed to add trainer.");
    }
  };

  const addMember = async (name: string) => {
    try {
      setError(null);
      await rosterService.addMember(name);
      await refresh();
    } catch {
      setError("Failed to add member.");
    }
  };

  return { trainers, members, loading, error, refresh, addTrainer, addMember };
}
