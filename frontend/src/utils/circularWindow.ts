/** How many items a circular strip should render. Never more than `total`. */
export function visibleCount(total: number, maxVisible: number): number {
  if (total <= 0 || maxVisible <= 0) return 0;
  return Math.min(maxVisible, total);
}

/**
 * Indices for a looping strip.
 * The selected item sits in the center. With 5 skins and the first selected,
 * the order is 4, 5, 1, 2, 3. Short lists stay shorter: a missing skin is
 * omitted instead of leaving an empty slot.
 * The result length is `min(maxVisible, total)`, so short lists do not invent
 * empty slots or repeat an item to fill the track.
 */
export function getCircularWindow(
  selected: number,
  total: number,
  maxVisible: number,
): number[] {
  const count = visibleCount(total, maxVisible);
  if (count === 0) return [];

  const current = normalizeIndex(selected, total);
  const focus = Math.floor((count - 1) / 2);
  const start = (current - focus + total) % total;

  return Array.from({ length: count }, (_, offset) => (start + offset) % total);
}

export function normalizeIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

export function stepIndex(index: number, total: number, delta: number): number {
  if (total <= 0) return 0;
  return normalizeIndex(index + delta, total);
}

/** Shortest-path direction around the loop. Forward wins ties. */
export function circularDirection(
  from: number,
  to: number,
  total: number,
): 1 | -1 {
  if (total <= 1 || from === to) return 1;
  const forward = (to - from + total) % total;
  const backward = (from - to + total) % total;
  return forward <= backward ? 1 : -1;
}
