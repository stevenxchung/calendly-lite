import { TimeBlocks } from "@/types";

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const weekends = new Set(["Sun", "Sat"]);

export function hasOverlap(
  start: Date,
  end: Date,
  timeBlocks: TimeBlocks
): boolean {
  if (!timeBlocks) return false;

  return Object.values(timeBlocks).some((block) => {
    const bStart = block.start!.getTime();
    const bEnd = block.end!.getTime();
    return !(end.getTime() <= bStart || start.getTime() >= bEnd);
  });
}

export function getShortDateString(
  day: string,
  month: number,
  dayOfMonth: number
): string {
  return `${day} ${month + 1}/${dayOfMonth}`;
}

export function formatHourMinute(date: Date | null): string {
  if (!date) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
