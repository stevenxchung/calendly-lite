"use client";

import React, { useEffect, useState } from "react";

interface TimeBlock {
  start: Date | null;
  end: Date | null;
}

interface CalendarProps {
  startTime: Date | null;
  currentDate: Date;
  selectedTimes: { [key: string]: TimeBlock };
  handleBlockSelection: (day: string, time: Date) => void;
  handleMouseOrTouchMove: (day: string, time: Date) => void;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  dragging: (isDragging: boolean) => void;
}

interface SelectedTimeBlocksProps {
  selectedBlocks: string[];
  handleReset: () => void;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekends = new Set(["Sun", "Sat"]);

const getShortDateString = (day: string, time: Date) => {
  const date = time.getDate() - time.getDay() + daysOfWeek.indexOf(day);
  return `${day} ${time.getMonth() + 1}/${date}`;
};

const CalendarComponent: React.FC<CalendarProps> = ({
  startTime: startSelection,
  currentDate,
  selectedTimes,
  handleBlockSelection,
  handleMouseOrTouchMove,
  dragging,
  handlePrevWeek,
  handleNextWeek,
}) => {
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

  const handleStart = (day: string, time: Date) => {
    handleBlockSelection(day, time);
  };

  const handleMove = (day: string, time: Date) => {
    // Prevent selecting outside of current date column
    if (startSelection?.getDay() === time.getDay()) {
      handleMouseOrTouchMove(day, time);
    }
  };

  const handleEnd = () => {
    dragging(false);
  };

  return (
    <div className="m-4">
      <div className="flex flex-row justify-between mb-4">
        <button
          onClick={handlePrevWeek}
          className="text-3xl w-16 bg-blue-500 hover:bg-blue-400 text-white rounded-md"
        >
          {"<-"}
        </button>
        <button
          onClick={handleNextWeek}
          className="text-3xl w-16 bg-blue-500 hover:bg-blue-400 text-white rounded-md"
        >
          {"->"}
        </button>
      </div>
      <div className="grid sm:grid-cols-3 md:grid-cols-5 select-none">
        {daysOfWeek.map((day, index) => {
          // Skip weekends
          if (weekends.has(day)) {
            return;
          }

          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - currentDate.getDay() + index);
          const shortDate = getShortDateString(day, date);
          const dayTimes = selectedTimes[shortDate];

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
                    dayTimes?.start &&
                    dayTimes?.end &&
                    time >= dayTimes.start &&
                    time <= dayTimes.end &&
                    time.getHours() >= dayTimes.start.getHours() &&
                    time.getHours() <= dayTimes.end.getHours();

                  const isFullHour = minute === 0;

                  return (
                    <div
                      key={timeIndex}
                      className={`text-sm cursor-pointer p-1 border border-gray-200 ${
                        isSelected ? "bg-blue-200" : "hover:bg-gray-100"
                      } ${isFullHour ? "font-bold" : ""}`}
                      onMouseDown={() => handleStart(day, time)}
                      onMouseEnter={() => handleMove(day, time)}
                      onMouseUp={() => (!isMobile ? handleEnd() : handleEnd)}
                    >
                      {time.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SelectedTimeBlocksComponent: React.FC<SelectedTimeBlocksProps> = ({
  selectedBlocks,
  handleReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = selectedBlocks.join("\n");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center p-4">
        <h2 className="text-lg font-bold">Selected Time Blocks:</h2>
        <ul className="list-disc list-inside">
          {selectedBlocks.map((block, index) => (
            <li key={index}>{block}</li>
          ))}
        </ul>
      </div>
      <div className="flex">
        <button
          onClick={handleReset}
          className="mb-4 ml-2 px-4 py-2 w-full bg-red-500 hover:bg-red-400 text-white rounded-md"
        >
          Reset
        </button>
        <button
          onClick={handleCopy}
          className="mb-4 ml-2 px-4 py-2 w-full bg-green-500 hover:bg-green-400 text-white rounded-md"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

const CalendarApp: React.FC = () => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<{
    [key: string]: TimeBlock;
  }>({});
  const [dragging, setDragging] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatSelectedBlocks = (selectedTimes: {
    [key: string]: TimeBlock;
  }): string[] => {
    const formattedBlocks: string[] = [];
    for (const dateString in selectedTimes) {
      const { start, end } = selectedTimes[dateString];
      if (start && end) {
        const startTimeString = start.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
        const endTimeString = end.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
        formattedBlocks.push(
          `${dateString}, ${startTimeString} - ${endTimeString} EST`
        );
      }
    }
    return formattedBlocks.sort((a, b) => {
      const dateA = a.split(" ")[1];
      const dateB = b.split(" ")[1];
      const [aMonth, aDay] = dateA.split("/").map((e) => parseInt(e, 10));
      const [bMonth, bDay] = dateB.split("/").map((e) => parseInt(e, 10));

      if (aMonth !== bMonth) {
        return aMonth - bMonth;
      } else {
        return aDay - bDay;
      }
    });
  };

  const handleBlockSelection = (day: string, time: Date) => {
    if (!dragging) {
      // Mouse down triggers dragging
      setStartTime(time);
      setDragging(true);
    } else {
      // Mouse up terminates dragging
      setDragging(false);
      const start = startTime || new Date();
      const end = time > start ? time : start;
      const shortDate = getShortDateString(day, time);
      const newSelectedTimes = {
        ...selectedTimes,
        [shortDate]: { start, end },
      };
      setSelectedTimes(newSelectedTimes);
      setStartTime(null);
      setSelectedBlocks(formatSelectedBlocks(newSelectedTimes));
    }
  };

  const handleMouseOrTouchMove = (day: string, time: Date) => {
    if (dragging) {
      const start = startTime || new Date();
      const end = time > start ? time : start;
      const shortDate = getShortDateString(day, time);
      const newSelectedTimes = {
        ...selectedTimes,
        [shortDate]: { start, end },
      };
      setSelectedTimes(newSelectedTimes);
      setSelectedBlocks(formatSelectedBlocks(newSelectedTimes));
    }
  };

  const handleReset = () => {
    setCurrentDate(new Date());
    setSelectedBlocks([]);
    setSelectedTimes({});
  };

  const handlePrevWeek = () => {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - prevWeekDate.getDay() - 7);
    setCurrentDate(prevWeekDate);
  };

  const handleNextWeek = () => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(nextWeekDate.getDate() - nextWeekDate.getDay() + 7);
    setCurrentDate(nextWeekDate);
  };

  const handleDragging = (isDragging: boolean) => {
    setDragging(isDragging);
  };

  return (
    <div className="md:flex md:flex-row md:items-center md:justify-evenly">
      <SelectedTimeBlocksComponent
        selectedBlocks={selectedBlocks}
        handleReset={handleReset}
      />
      <CalendarComponent
        startTime={startTime}
        currentDate={currentDate}
        selectedTimes={selectedTimes}
        handleBlockSelection={handleBlockSelection}
        handleMouseOrTouchMove={handleMouseOrTouchMove}
        dragging={handleDragging}
        handlePrevWeek={handlePrevWeek}
        handleNextWeek={handleNextWeek}
      />
    </div>
  );
};

export default CalendarApp;
