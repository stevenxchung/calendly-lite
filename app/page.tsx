"use client";

import React, { useState } from "react";

interface TimeBlock {
  start: Date | null;
  end: Date | null;
}

const CalendarApp: React.FC = () => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<{
    [key: string]: TimeBlock;
  }>({});
  const [dragging, setDragging] = useState<boolean>(false);
  const [startSelection, setStartSelection] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const startDate = currentDate.getDate() - currentDate.getDay() + 1;

  const getShortDateString = (day: string, time: Date) => {
    const date = time.getDate() - time.getDay() + daysOfWeek.indexOf(day) + 1;
    return `${day} ${time.getMonth()}/${date}`;
  };

  const handleBlockSelection = (day: string, time: Date) => {
    if (!dragging) {
      setDragging(true);
      setStartSelection(time);
    } else {
      setDragging(false);
      const start = startSelection || new Date();
      const end = time > start ? time : start;
      const shortDate = getShortDateString(day, time);
      const newSelectedTimes = {
        ...selectedTimes,
        [shortDate]: { start, end },
      };
      setSelectedTimes(newSelectedTimes);
      setStartSelection(null);
      setSelectedBlocks(formatSelectedBlocks(newSelectedTimes));
    }
  };

  const handleMouseMove = (day: string, time: Date) => {
    if (dragging) {
      const start = startSelection || new Date();
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
      const [aMonth, aDay] = dateA.split("/").map(Number);
      const [bMonth, bDay] = dateB.split("/").map(Number);

      if (aMonth !== bMonth) {
        return aMonth - bMonth;
      } else {
        return aDay - bDay;
      }
    });
  };

  const handleReset = () => {
    setSelectedBlocks([]);
    setSelectedTimes({});
  };

  const handlePrevWeek = () => {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    setCurrentDate(prevWeekDate);
  };

  const handleNextWeek = () => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    setCurrentDate(nextWeekDate);
  };

  return (
    <div className="flex flex-row items-center justify-evenly">
      <div className="grid grid-cols-5 gap-2 p-4 select-none">
        {daysOfWeek.map((day, index) => {
          const date = startDate + index;
          const shortDate = getShortDateString(day, currentDate);
          const dayTimes = selectedTimes[shortDate];

          return (
            <div key={day} className="border border-gray-300 p-2">
              <h2 className="text-lg font-bold mb-2">
                {day} {date}
              </h2>
              <div>
                {Array.from(Array(49).keys()).map((_, timeIndex) => {
                  const hour = Math.floor(timeIndex / 4) + 8;
                  const minute = (timeIndex % 4) * 15;
                  const time = new Date(currentDate);
                  time.setHours(hour);
                  time.setMinutes(minute);

                  const isSelected =
                    dayTimes?.start &&
                    dayTimes?.end &&
                    time >= dayTimes.start &&
                    time <= dayTimes.end;
                  const isStartSelected =
                    dayTimes?.start &&
                    time.getHours() === dayTimes.start.getHours() &&
                    time.getMinutes() === dayTimes.start.getMinutes();
                  const isEndSelected =
                    dayTimes?.end &&
                    time.getHours() === dayTimes.end.getHours() &&
                    time.getMinutes() === dayTimes.end.getMinutes();

                  const isFullHour = minute === 0; // Check if it's a full hour

                  return (
                    <div
                      key={timeIndex}
                      className={`text-sm cursor-pointer p-1 border border-gray-200 ${
                        isSelected || isStartSelected || isEndSelected
                          ? "bg-blue-200"
                          : "hover:bg-gray-100"
                      } ${isFullHour ? "font-bold" : ""}`}
                      onMouseDown={() => handleBlockSelection(day, time)}
                      onMouseEnter={() => handleMouseMove(day, time)}
                      onMouseUp={() => setDragging(false)}
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
            className="mb-4 p-2 bg-gray-500 text-white rounded-md"
          >
            Reset
          </button>
          <button
            onClick={handlePrevWeek}
            className="mb-4 ml-2 p-2 bg-gray-500 text-white rounded-md"
          >
            Previous Week
          </button>
          <button
            onClick={handleNextWeek}
            className="mb-4 ml-2 p-2 bg-gray-500 text-white rounded-md"
          >
            Next Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
