import React, { useEffect, useState } from "react";
import { daysOfWeek, getShortDateString, weekends } from "@/utils/dateUtils";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import DayColumn from "@/components/DayColumn";
import WeekSelector from "@/components/WeekSelector";

const Calendar: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    selectedTimes,
    setSelectedTimes,
    resetCounter,
  } = useCalendarContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    // Initial check
    checkMobileView();

    // Add event listener to check when window is resized
    window.addEventListener("resize", checkMobileView);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  return (
    <div className="m-4">
      <WeekSelector currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <div className="grid sm:grid-cols-3 md:grid-cols-5 select-none">
        {daysOfWeek.map((day, index) => {
          // Skip weekends
          if (weekends.has(day)) {
            return;
          }

          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - currentDate.getDay() + index);
          const shortDate = getShortDateString(
            day,
            date.getMonth(),
            date.getDate()
          );

          return (
            <DayColumn
              key={day}
              day={day}
              year={date.getFullYear()}
              month={date.getMonth()}
              dayOfMonth={date.getDate()}
              shortDate={shortDate}
              timeBlocks={selectedTimes[shortDate]}
              setSelectedTimes={setSelectedTimes}
              resetCounter={resetCounter}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
