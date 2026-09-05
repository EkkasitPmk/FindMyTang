export type FilterState = {
  searchKeyword?: string;
  assetId?: string;
  isSearchMode?: boolean;
};

export function getAbsoluteTop(
  element: HTMLElement,
  container: HTMLElement,
): number {
  return (
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop
  );
}

export function adjustScrollAnchor(
  scrollElement: HTMLElement,
  targetId: string,
  positions: Map<string, number>,
): void {
  const oldTop = positions.get(targetId);
  if (oldTop === undefined) return;

  const el = scrollElement.querySelector<HTMLElement>(
    `[data-transaction-id="${targetId}"]`,
  );
  if (!el) return;

  const delta = getAbsoluteTop(el, scrollElement) - oldTop;
  if (Math.abs(delta) <= 1) return;

  scrollElement.dataset.programmaticScroll = "true";
  scrollElement.scrollTop += delta;
  requestAnimationFrame(() => {
    scrollElement.dataset.programmaticScroll = "false";
  });
}

export function recordItemPositions(
  scrollElement: HTMLElement,
  positions: Map<string, number>,
): void {
  positions.clear();
  scrollElement
    .querySelectorAll<HTMLElement>("[data-transaction-id]")
    .forEach((el) => {
      const id = el.dataset.transactionId;
      if (id) positions.set(id, getAbsoluteTop(el, scrollElement));
    });
}

export function hasFilterChanged(
  prev: FilterState,
  next: FilterState,
): boolean {
  return (
    prev.searchKeyword !== next.searchKeyword ||
    prev.assetId !== next.assetId ||
    prev.isSearchMode !== next.isSearchMode
  );
}
