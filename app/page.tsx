"use client";

import { CalendarContext } from "@/hooks/useCalendarContext";
import { useCalendarSelector } from "@/hooks/useCalendarSelector";
import Calendar from "@/components/Calendar";
import SelectedTimeBlocks from "@/components/SelectedTimeBlocks";

export default function CalendarApp() {
  const {
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
  } = useCalendarSelector();

  return (
    <div className="md:flex md:flex-row md:items-center md:justify-evenly">
      <SelectedTimeBlocks
        selectedBlocks={selectedBlocks}
        handleReset={handleReset}
      />
      <CalendarContext.Provider
        value={{
          currentDate,
          startTime,
          selectedTimes,
          handleBlockSelection,
          handleMouseOrTouchMove,
          handleDragging,
          handlePrevWeek,
          handleNextWeek,
        }}
      >
        <Calendar />
      </CalendarContext.Provider>
    </div>
  );
}
