import { SelectedTimes, TimeBlock, TimeBlocks } from "@/types";
import { formatHourMinute } from "./dateUtils";

// Accessible color palette (e.g. via https://yeun.github.io/open-color/)
export const COLORS = [
  "#FFCB6B", // yellow
  "#82AAFF", // blue
  "#C3E88D", // green
  "#F07178", // red
  "#FF5370", // pink
  "#89DDFF", // cyan
  "#F78C6C", // orange
  "#A3A3A3", // gray
  "#C792EA", // purple
  "#E0E0E0", // light-gray
];

export function buildSelectedBlockSet(timeBlocks: TimeBlocks) {
  const set = new Set();
  Object.values(timeBlocks || {}).forEach((block) => {
    if (block?.start && block?.end) {
      let t = new Date(block.start);
      const end = new Date(block.end);
      while (t <= end) {
        set.add(formatHourMinute(t));
        t = new Date(t.getTime() + 15 * 60000);
      }
    }
  });
  return set;
}

export function getBlockColorAtTime(
  time: Date,
  mergedBlocks: TimeBlock[],
  mergedColors: string[]
) {
  for (let i = 0; i < mergedBlocks.length; i++) {
    const block = mergedBlocks[i];
    if (block.start && block.end && time >= block.start && time <= block.end) {
      return mergedColors[i];
    }
  }
  return undefined;
}

export function getMergedColorsForDay(mergedBlocks: TimeBlock[]) {
  return mergedBlocks.map((_, idx) => COLORS[idx % COLORS.length]);
}

export function getMergedBlocksForDay(
  timeBlocks: TimeBlocks
): TimeBlock[] | [] {
  if (!timeBlocks) return [];

  // Get merged blocks [{start, end},...] given timeBlocks (for one day)
  const blocks: TimeBlock[] = [];
  for (const { start, end } of Object.values(timeBlocks)) {
    if (start instanceof Date && end instanceof Date) {
      blocks.push({ start, end });
    }
  }

  if (blocks.length === 0) return [];
  blocks.sort((a, b) => a.start!.getTime() - b.start!.getTime());

  const merged: TimeBlock[] = [];
  for (const block of blocks) {
    const last = merged[merged.length - 1];
    if (last && last.end!.getTime() === block.start!.getTime()) {
      last.end = block.end;
    } else {
      merged.push({ ...block });
    }
  }

  return merged;
}

export function formatSelectedBlocks(
  selectedTimes: SelectedTimes
): Map<string, string[]> {
  const formattedBlocks = new Map<string, string[]>();
  for (const [dateString, timeBlocks] of Object.entries(selectedTimes)) {
    const merged = getMergedBlocksForDay(timeBlocks);
    const formatted = merged.map(
      ({ start, end }) =>
        `${formatHourMinute(start)} - ${formatHourMinute(end)} EST`
    );
    formattedBlocks.set(dateString, formatted);
  }

  return formattedBlocks;
}
