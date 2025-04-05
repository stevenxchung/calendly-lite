import { useState } from "react";
import { SelectedTimes } from "@/types";
import { formatSelectedBlocks, getShortDateString } from "@/utils/dateUtils";

export function useCalendarSelector() {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<SelectedTimes>({});
  const [dragging, setDragging] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleBlockSelection = (day: string, time: Date) => {
    if (!dragging) {
      // Mouse down triggers dragging
      setStartTime(time);
      setDragging(true);
    } else {
      // Mouse up terminates dragging
      setDragging(false);
      const start = startTime || new Date();
      const end = time > start ? time : start;
      const shortDate = getShortDateString(day, time);
      const newSelectedTimes = {
        ...selectedTimes,
        [shortDate]: { start, end },
      };
      setSelectedTimes(newSelectedTimes);
      setStartTime(null);
      setSelectedBlocks(formatSelectedBlocks(newSelectedTimes));
    }
  };

  const handleMouseOrTouchMove = (day: string, time: Date) => {
    if (dragging) {
      const start = startTime || new Date();
      const end = time > start ? time : start;
      const shortDate = getShortDateString(day, time);
      const newSelectedTimes = {
        ...selectedTimes,
        [shortDate]: { start, end },
      };
      setSelectedTimes(newSelectedTimes);
      setSelectedBlocks(formatSelectedBlocks(newSelectedTimes));
    }
  };

  const handleReset = () => {
    setCurrentDate(new Date());
    setSelectedBlocks([]);
    setSelectedTimes({});
  };

  const handlePrevWeek = () => {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - prevWeekDate.getDay() - 7);
    setCurrentDate(prevWeekDate);
  };

  const handleNextWeek = () => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(nextWeekDate.getDate() - nextWeekDate.getDay() + 7);
    setCurrentDate(nextWeekDate);
  };

  const handleDragging = (isDragging: boolean) => {
    setDragging(isDragging);
  };

  return {
    currentDate,
    startTime,
    selectedBlocks,
    selectedTimes,
    handleBlockSelection,
    handleMouseOrTouchMove,
    handleDragging,
    handlePrevWeek,
    handleNextWeek,
    handleReset,
  };
}
