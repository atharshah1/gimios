import { useCallback, useEffect, useState } from "react";
import { slotsService } from "../services/slots";
import { TimeSlot } from "../services/types";

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
  }, [refresh]);

  const createSlot = async (slot: Omit<TimeSlot, "id">) => {
    try {
      setError(null);
      await slotsService.createSlot(slot);
      await refresh();
    } catch {
      setError("Failed to create slot.");
    }
  };

  return { slots, loading, error, refresh, createSlot };
}
