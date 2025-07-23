"use client";

import { useEffect } from "react";
import { CalendarContext } from "@/hooks/useCalendarContext";
import { useCalendarSelector } from "@/hooks/useCalendarSelector";
import { formatSelectedBlocks } from "@/utils/timeBlockUtils";
import SelectedTimeBlocks from "@/components/SelectedTimeBlocks";
import Calendar from "@/components/Calendar";

export default function CalendarApp() {
  const {
    currentDate,
    setCurrentDate,
    selectedBlocks,
    setSelectedBlocks,
    selectedTimes,
    setSelectedTimes,
    resetCounter,
    handleReset,
  } = useCalendarSelector();

  useEffect(() => {
    // Whenever selectedTimes changes, update selectedBlocks
    setSelectedBlocks(formatSelectedBlocks(selectedTimes));
  }, [selectedTimes]);

  return (
    <div className="md:flex md:flex-row md:items-center md:justify-evenly">
      <SelectedTimeBlocks
        selectedBlocks={selectedBlocks}
        handleReset={handleReset}
      />
      <CalendarContext.Provider
        value={{
          currentDate,
          setCurrentDate,
          selectedTimes,
          setSelectedTimes,
          resetCounter,
        }}
      >
        <Calendar />
      </CalendarContext.Provider>
    </div>
  );
}
