import React from "react";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import TimeBlockCell from "@/components/TimeBlockCell";

interface DayColumnProps {
  isMobile: boolean;
  day: string;
  date: Date;
  shortDate: string;
}

const DayColumn: React.FC<DayColumnProps> = ({
  isMobile,
  day,
  date,
  shortDate,
}) => {
  const { selectedTimes } = useCalendarContext();
  const timestamps = selectedTimes[shortDate];

  return (
    <div key={day} className="border border-gray-300 p-2 pb-5 w-full">
      <h2 className="text-purple-600 text-xl font-bold mb-2 h-12">
        {day} {date.getMonth() + 1}
        <span>/</span>
        {date.getDate()}
      </h2>

      <div>
        {Array.from(Array(49).keys()).map((_, timeIndex) => {
          const hour = Math.floor(timeIndex / 4) + 8;
          const minute = (timeIndex % 4) * 15;
          const time = new Date(date);
          time.setHours(hour);
          time.setMinutes(minute);

          const isSelected =
            timestamps?.start &&
            timestamps?.end &&
            time >= timestamps.start &&
            time <= timestamps.end &&
            time.getHours() >= timestamps.start.getHours() &&
            time.getHours() <= timestamps.end.getHours();

          const isFullHour = minute === 0;

          return (
            <TimeBlockCell
              isMobile={isMobile}
              key={timeIndex}
              day={day}
              time={time}
              isFullHour={isFullHour}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DayColumn;
