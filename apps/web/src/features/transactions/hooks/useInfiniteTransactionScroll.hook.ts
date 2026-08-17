import { useCallback, useRef, type UIEvent } from "react";

interface UseInfiniteTransactionScrollParams {
  isLoadingTransactions: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  fetchPreviousPage?: () => void;
  fetchNextPage?: () => void;
}

export function useInfiniteTransactionScroll({
  isLoadingTransactions,
  isFetchingPreviousPage,
  isFetchingNextPage,
  hasPreviousPage,
  hasNextPage,
  fetchPreviousPage,
  fetchNextPage,
}: UseInfiniteTransactionScrollParams) {
  const previousScrollTop = useRef(0);
  const wasNearTop = useRef(false);
  const wasNearBottom = useRef(false);
  const previousPageRequested = useRef(false);
  const nextPageRequested = useRef(false);
  const onScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const scrollDelta = scrollTop - previousScrollTop.current;
      previousScrollTop.current = scrollTop;
      const isNearTop = scrollTop < 160;
      const isNearBottom = distanceFromBottom < 200;
      const enteredTop = isNearTop && !wasNearTop.current;
      const enteredBottom = isNearBottom && !wasNearBottom.current;
      wasNearTop.current = isNearTop;
      wasNearBottom.current = isNearBottom;

      if (!isNearTop) previousPageRequested.current = false;
      if (!isNearBottom) nextPageRequested.current = false;

      if (isLoadingTransactions) return;

      if (
        scrollDelta < 0 &&
        enteredTop &&
        !previousPageRequested.current &&
        !isFetchingPreviousPage &&
        hasPreviousPage &&
        fetchPreviousPage
      ) {
        previousPageRequested.current = true;
        fetchPreviousPage();
      }

      if (
        scrollDelta > 0 &&
        enteredBottom &&
        !nextPageRequested.current &&
        !isFetchingNextPage &&
        hasNextPage &&
        fetchNextPage
      ) {
        nextPageRequested.current = true;
        fetchNextPage();
      }
    },
    [
      isLoadingTransactions,
      isFetchingPreviousPage,
      isFetchingNextPage,
      hasPreviousPage,
      hasNextPage,
      fetchPreviousPage,
      fetchNextPage,
    ],
  );

  return onScroll;
}
