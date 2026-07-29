import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 นาที — ไม่ refetch ถ้า data ยังใหม่
      gcTime: 1000 * 60 * 5, // 5 นาที — เก็บ cache ไว้ใน memory นานขึ้น
    },
  },
});

export const QUERY_CACHE_STORAGE_KEY = "fmt-qcache";
const MAX_AGE = 1000 * 60 * 5; // 5 นาที

if (typeof window !== "undefined") {
  const restoreCache = () => {
    try {
      const raw = localStorage.getItem(QUERY_CACHE_STORAGE_KEY);
      if (!raw) return;
      const { ts, entries } = JSON.parse(raw) as {
        ts: number;
        entries: { key: string; data: unknown }[];
      };
      if (Date.now() - ts < MAX_AGE) {
        for (const { key, data } of entries) {
          queryClient.setQueryData(JSON.parse(key), data);
        }
      }
    } catch {}
  };

  restoreCache();

  // Save on successful query updates (debounced to avoid hammering localStorage)
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === "updated" && event.query.state.status === "success") {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        try {
          const entries = queryClient
            .getQueryCache()
            .getAll()
            .filter((q) => q.state.status === "success")
            .map((q) => ({
              key: JSON.stringify(q.queryKey),
              data: q.state.data,
            }));
          localStorage.setItem(
            QUERY_CACHE_STORAGE_KEY,
            JSON.stringify({ ts: Date.now(), entries }),
          );
        } catch {}
      }, 500);
    }
  });
}
