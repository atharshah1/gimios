import { useCallback, useEffect, useState } from "react";
import { mobileApi, TimeSlot } from "../services/api";

export function useSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await mobileApi.listSlots();
    setSlots(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      refresh();
    }, 1500);
    return () => clearInterval(timer);
  }, [refresh]);

  const createSlot = async (slot: Omit<TimeSlot, "id">) => {
    await mobileApi.createSlot(slot);
    await refresh();
  };

  return { slots, loading, refresh, createSlot };
}
