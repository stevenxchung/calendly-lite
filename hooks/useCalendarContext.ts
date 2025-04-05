import { createContext, useContext } from "react";
import { SelectedTimes } from "@/types";

interface CalendarContextType {
  currentDate: Date;
  startTime: Date | null;
  selectedTimes: SelectedTimes;
  handleBlockSelection: (day: string, time: Date) => void;
  handleMouseOrTouchMove: (day: string, time: Date) => void;
  handleDragging: (isDragging: boolean) => void;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  return context;
};
