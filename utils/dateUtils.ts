import { SelectedTimes } from "@/types";

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const weekends = new Set(["Sun", "Sat"]);

export const getShortDateString = (day: string, time: Date) => {
  const date = time.getDate() - time.getDay() + daysOfWeek.indexOf(day);
  return `${day} ${time.getMonth() + 1}/${date}`;
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatSelectedBlocks(selectedTimes: SelectedTimes): string[] {
  const formattedBlocks: string[] = [];
  for (const dateString in selectedTimes) {
    const { start, end } = selectedTimes[dateString];
    if (start && end) {
      const startTimeString = formatTime(start);
      const endTimeString = formatTime(end);
      formattedBlocks.push(
        `${dateString}, ${startTimeString} - ${endTimeString} EST`
      );
    }
  }
  return formattedBlocks.sort((a, b) => {
    const dateA = a.split(" ")[1];
    const dateB = b.split(" ")[1];
    const [aMonth, aDay] = dateA.split("/").map((e) => parseInt(e, 10));
    const [bMonth, bDay] = dateB.split("/").map((e) => parseInt(e, 10));

    if (aMonth !== bMonth) {
      return aMonth - bMonth;
    } else {
      return aDay - bDay;
    }
  });
}
