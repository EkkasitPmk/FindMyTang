import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 นาที — ไม่ refetch ถ้า data ยังใหม่
      gcTime: 1000 * 60 * 5, // 5 นาที — เก็บ cache ไว้ใน memory นานขึ้น
    },
  },
});
