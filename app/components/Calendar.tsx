import React, { useEffect, useState } from "react";
import { daysOfWeek, getShortDateString, weekends } from "@/utils/dateUtils";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import DayColumn from "@/components/DayColumn";
import WeekSelector from "@/components/WeekSelector";

const Calendar: React.FC = () => {
  const { currentDate, handlePrevWeek, handleNextWeek } = useCalendarContext();
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
      <WeekSelector
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
      />
      <div className="grid sm:grid-cols-3 md:grid-cols-5 select-none">
        {daysOfWeek.map((day, index) => {
          // Skip weekends
          if (weekends.has(day)) {
            return;
          }

          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - currentDate.getDay() + index);
          const shortDate = getShortDateString(day, date);

          return (
            <DayColumn
              key={day}
              day={day}
              date={date}
              shortDate={shortDate}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
