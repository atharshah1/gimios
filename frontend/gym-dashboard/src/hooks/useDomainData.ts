import { useCallback, useEffect, useRef, useState } from "react";

export function useDomainData<T>(loader: () => Promise<T>, deps: readonly unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loaderRef.current());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, ...deps]);

  return { data, loading, error, refresh };
}
