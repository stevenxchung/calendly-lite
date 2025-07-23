import { useState } from "react";
import { SelectedTimes } from "@/types";

export function useCalendarSelector() {
  // Global states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimes, setSelectedTimes] = useState<SelectedTimes>({});
  const [selectedBlocks, setSelectedBlocks] = useState<Map<string, string[]>>(
    new Map()
  );
  const [resetCounter, setResetCounter] = useState<number>(0);

  const handleReset = () => {
    setCurrentDate(new Date());
    setSelectedBlocks(new Map());
    setSelectedTimes({});
    setResetCounter((c) => c + 1);
  };

  return {
    currentDate,
    setCurrentDate,
    selectedBlocks,
    setSelectedBlocks,
    selectedTimes,
    setSelectedTimes,
    resetCounter,
    handleReset,
  };
}
