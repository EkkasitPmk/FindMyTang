export function getDiffDays(date: Date | undefined): number | null {
  if (!date) return null;
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfSelected = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = startOfSelected.getTime() - startOfToday.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDisplayDate(date: Date | undefined): string {
  const diffDays = getDiffDays(date);
  if (diffDays === null || !date) return "";

  let prefix = "";
  if (diffDays === 0) {
    prefix = "Today";
  } else if (diffDays === 1) {
    prefix = "Tomorrow";
  } else if (diffDays === -1) {
    prefix = "Yesterday";
  } else if (diffDays % 7 === 0) {
    const weeks = Math.abs(diffDays) / 7;
    const suffix = weeks > 1 ? "s" : "";
    prefix =
      diffDays > 0 ? `In ${weeks} week${suffix}` : `${weeks} week${suffix} ago`;
  } else {
    prefix =
      diffDays > 0
        ? `In ${Math.abs(diffDays)} days`
        : `${Math.abs(diffDays)} days ago`;
  }

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return prefix ? `${prefix}, ${dateStr}` : dateStr;
}
