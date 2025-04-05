import React from "react";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import { formatTime } from "@/utils/dateUtils";

interface TimeBlockCellProps {
  isMobile: boolean;
  day: string;
  time: Date;
  isFullHour: boolean;
  isSelected: boolean | null;
}

const TimeBlockCell: React.FC<TimeBlockCellProps> = ({
  isMobile,
  day,
  time,
  isFullHour,
  isSelected,
}) => {
  const {
    startTime,
    handleBlockSelection,
    handleMouseOrTouchMove,
    handleDragging,
  } = useCalendarContext();

  return (
    <div
      className={`text-sm cursor-pointer p-1 border border-gray-200 ${
        isSelected ? "bg-blue-200" : "hover:bg-gray-100"
      } ${isFullHour ? "font-bold" : ""}`}
      onMouseDown={() => handleBlockSelection(day, time)}
      onMouseEnter={() => {
        // Prevent selecting outside of current date column
        if (startTime?.getDay() === time.getDay()) {
          handleMouseOrTouchMove(day, time);
        }
      }}
      onMouseUp={() => (!isMobile ? handleDragging(false) : handleDragging)}
    >
      {formatTime(time)}
    </div>
  );
};

export default TimeBlockCell;
