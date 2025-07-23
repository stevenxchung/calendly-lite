import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { SelectedTimes } from "@/types";

interface CalendarContextType {
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  selectedTimes: SelectedTimes;
  setSelectedTimes: Dispatch<SetStateAction<SelectedTimes>>;
  resetCounter: number;
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
