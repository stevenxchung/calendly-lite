import React, { Dispatch, SetStateAction } from "react";

interface WeekSelectorProps {
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  currentDate,
  setCurrentDate,
}) => {
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

  return (
    <div className="flex flex-row justify-between mb-4">
      <button
        onClick={handlePrevWeek}
        className="text-3xl w-16 bg-blue-500 hover:bg-blue-400 text-white rounded-md"
      >
        {"⬅"}
      </button>
      <button
        onClick={handleNextWeek}
        className="text-3xl w-16 bg-blue-500 hover:bg-blue-400 text-white rounded-md"
      >
        {"➡"}
      </button>
    </div>
  );
};

export default WeekSelector;
