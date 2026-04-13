import { useCallback, useEffect, useState } from "react";
import { slotsService } from "../services/slots";
import { TimeSlot } from "../services/types";
import { subscribe } from "../services/events";

export function useSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await slotsService.listSlots();
      setSlots(data);
    } catch {
      setError("Failed to load slots.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("slots:changed", refresh);
  }, [refresh]);

  const createSlot = async (slot: Omit<TimeSlot, "id">) => {
    const optimistic: TimeSlot = { id: `temp-${Date.now()}`, ...slot };
    setSlots((prev) => [...prev, optimistic]);

    try {
      setError(null);
      const created = await slotsService.createSlot(slot);
      setSlots((prev) => prev.map((item) => (item.id === optimistic.id ? created : item)));
    } catch {
      setSlots((prev) => prev.filter((item) => item.id !== optimistic.id));
      setError("Failed to create slot.");
    }
  };

  return { slots, loading, error, refresh, createSlot };
}
