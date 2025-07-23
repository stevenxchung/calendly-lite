import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import TimeBlockCell from "@/components/TimeBlockCell";
import ContextMenu from "@/components/ContextMenu";
import { SelectedTimes, TimeBlocks } from "@/types";
import { formatHourMinute, hasOverlap } from "@/utils/dateUtils";
import {
  buildSelectedBlockSet,
  getBlockColorAtTime,
  getMergedBlocksForDay,
  getMergedColorsForDay,
} from "@/utils/timeBlockUtils";

interface DayColumnProps {
  day: string;
  year: number;
  month: number;
  dayOfMonth: number;
  shortDate: string;
  timeBlocks: TimeBlocks;
  setSelectedTimes: Dispatch<SetStateAction<SelectedTimes>>;
  resetCounter: number;
}

const DayColumn: React.FC<DayColumnProps> = ({
  day,
  year,
  month,
  dayOfMonth,
  shortDate,
  timeBlocks,
  setSelectedTimes,
  resetCounter,
}) => {
  // Local states
  const [dragging, setDragging] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [previewEndTime, setPreviewEndTime] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleResetDay = () => {
    setSelectedTimes((prev) => {
      const newTimes = { ...prev };
      delete newTimes[shortDate];
      return newTimes;
    });
    setMenuPos(null);
  };

  useEffect(() => {
    setDragging(false);
    setStartTime(null);
    setPreviewEndTime(null);
  }, [resetCounter]);

  // For rendering, highlight between startTime and previewEndTime if dragging
  const previewRange =
    dragging && startTime !== null && previewEndTime !== null
      ? {
          start: Math.min(startTime, previewEndTime),
          end: Math.max(startTime, previewEndTime),
        }
      : null;

  const handleBlockSelection = useCallback(
    (timeValue: number) => {
      if (!dragging) {
        setDragging(true);
        setStartTime(timeValue);
        setPreviewEndTime(timeValue);
      } else {
        setDragging(false);
        if (startTime === null || previewEndTime === null) return;
        const start = new Date(Math.min(startTime, previewEndTime));
        const end = new Date(Math.max(startTime, previewEndTime));
        if (
          !hasOverlap(start, end, timeBlocks) &&
          start.getTime() !== end.getTime()
        ) {
          setSelectedTimes((prev) => {
            const newSelectedTimes = {
              ...prev,
              [shortDate]: {
                ...(prev[shortDate] || {}),
                [formatHourMinute(start)]: { start, end },
              },
            };
            return newSelectedTimes;
          });
        } else {
          toast.error("Selection overlaps an existing block!");
        }
        setStartTime(null);
        setPreviewEndTime(null);
      }
    },
    [
      dragging,
      startTime,
      previewEndTime,
      setSelectedTimes,
      shortDate,
      timeBlocks,
    ]
  );

  const handleMouseOrTouchMove = useCallback(
    (timeValue: number) => {
      if (!dragging) return;
      setPreviewEndTime(timeValue);
    },
    [dragging]
  );

  const selectedBlockSet = useMemo(
    () => buildSelectedBlockSet(timeBlocks),
    [timeBlocks]
  );

  const mergedBlocks = useMemo(
    () => getMergedBlocksForDay(timeBlocks),
    [timeBlocks]
  );

  const mergedColors = getMergedColorsForDay(mergedBlocks);

  return (
    <div
      className="border border-gray-300 p-2 pb-5 w-full"
      onContextMenu={handleContextMenu}
      style={{ position: "relative" }}
    >
      <h2 className="text-purple-600 text-xl font-bold mb-2 h-12">
        {day} {month + 1}/<span>{dayOfMonth}</span>
      </h2>
      <div>
        {Array.from({ length: 49 }).map((_, timeIndex) => {
          const hour = Math.floor(timeIndex / 4) + 8;
          const minute = (timeIndex % 4) * 15;
          const time = new Date(year, month, dayOfMonth, hour, minute, 0, 0);
          const timeValue = time.getTime();

          const isSelected = selectedBlockSet.has(formatHourMinute(time));
          const isPreviewSelected = previewRange
            ? timeValue >= previewRange.start && timeValue <= previewRange.end
            : false;

          // Get color from merged block, or preview color if preview-only
          let displayColor: string | undefined;
          if (isSelected) {
            displayColor = getBlockColorAtTime(
              time,
              mergedBlocks,
              mergedColors
            );
          } else if (isPreviewSelected) {
            displayColor = "#DBEAFE"; // Tailwind blue-100, or any preview color
          }
          return (
            <TimeBlockCell
              key={timeValue}
              timeValue={timeValue}
              isFullHour={minute === 0}
              isSelected={isSelected || isPreviewSelected}
              startTime={startTime}
              handleBlockSelection={handleBlockSelection}
              handleMouseOrTouchMove={handleMouseOrTouchMove}
              dragging={dragging}
              blockColor={displayColor}
            />
          );
        })}
        {menuPos && (
          <ContextMenu
            x={menuPos.x}
            y={menuPos.y}
            items={[
              {
                label: "Reset",
                onClick: handleResetDay,
              },
              {
                label: "Cancel",
                onClick: () => {},
              },
            ]}
            onClose={() => setMenuPos(null)}
          />
        )}
      </div>
    </div>
  );
};

// Only re-render if time blocks changed for a specific day
export default memo(DayColumn);
