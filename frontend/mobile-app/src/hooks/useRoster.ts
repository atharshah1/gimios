import { useCallback, useEffect, useState } from "react";
import { mobileApi } from "../services/api";

export function useRoster() {
  const [trainers, setTrainers] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [t, m] = await Promise.all([mobileApi.listTrainers(), mobileApi.listMembers()]);
    setTrainers(t);
    setMembers(m);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      refresh();
    }, 1500);
    return () => clearInterval(timer);
  }, [refresh]);

  const addTrainer = async (name: string) => {
    await mobileApi.addTrainer(name);
    await refresh();
  };

  const addMember = async (name: string) => {
    await mobileApi.addMember(name);
    await refresh();
  };

  return { trainers, members, loading, refresh, addTrainer, addMember };
}
