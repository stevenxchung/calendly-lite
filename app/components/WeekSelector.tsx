import React from "react";

interface WeekSelectorProps {
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  handlePrevWeek,
  handleNextWeek,
}) => {
  return (
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
  );
};

export default WeekSelector;
