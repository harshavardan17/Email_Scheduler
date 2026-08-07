import { useEffect, useState } from "react";

export function usePolling<T>(
  fetcher: () => Promise<T>,
  interval = 5000,
  refreshKey = 0
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const wrappedRefresh = async () => {
      if (!active) {
        return;
      }
      await refresh();
    };

    wrappedRefresh();
    const timer = window.setInterval(wrappedRefresh, interval);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [fetcher, interval, refreshKey]);

  return { data, loading, error, refresh };
}
