import React, { useMemo } from "react";
import { formatHourMinute } from "@/utils/dateUtils";

interface TimeBlockCellProps {
  timeValue: number;
  isFullHour: boolean;
  isSelected: boolean | null;
  startTime: number | null;
  dragging: boolean;
  handleBlockSelection: (timeValue: number) => void;
  handleMouseOrTouchMove: (timeValue: number) => void;
  blockColor?: string;
}

const TimeBlockCell: React.FC<TimeBlockCellProps> = ({
  timeValue,
  isFullHour,
  isSelected,
  startTime,
  dragging,
  handleBlockSelection,
  handleMouseOrTouchMove,
  blockColor,
}) => {
  return (
    <div
      className={`text-sm cursor-pointer p-1 border border-gray-200 
        ${isFullHour ? "font-bold" : ""} 
        ${!isSelected ? "hover:bg-gray-100" : ""}`}
      style={
        isSelected && blockColor ? { backgroundColor: blockColor } : undefined
      }
      onMouseDown={(e) => {
        if (e.button !== 0) return; // 0: left, 1: middle, 2: right
        handleBlockSelection(timeValue);
      }}
      onMouseEnter={() => {
        // Prevent selecting outside of current date column
        if (dragging && startTime !== null) {
          handleMouseOrTouchMove(timeValue);
        }
      }}
    >
      {formatHourMinute(new Date(timeValue))}
    </div>
  );
};

export default TimeBlockCell;
