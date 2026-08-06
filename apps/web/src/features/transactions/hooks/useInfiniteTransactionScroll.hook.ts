import { useCallback, useRef } from "react";

interface UseInfiniteTransactionScrollParams {
  useVirtualization: boolean;
  isLoadingTransactions: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage?: () => void;
}

export function useInfiniteTransactionScroll({
  useVirtualization,
  isLoadingTransactions,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: UseInfiniteTransactionScrollParams) {
  const observer = useRef<IntersectionObserver | null>(null);

  const observerTarget = useCallback(
    (node: HTMLDivElement | null) => {
      observer.current?.disconnect();
      if (
        !node ||
        useVirtualization ||
        isLoadingTransactions ||
        isFetchingNextPage
      ) {
        return;
      }

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasNextPage && fetchNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "800px 0px" },
      );
      observer.current.observe(node);
    },
    [
      useVirtualization,
      isLoadingTransactions,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
    ],
  );

  return observerTarget;
}
