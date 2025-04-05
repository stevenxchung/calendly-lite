import React, { useState } from "react";

interface SelectedTimeBlocksProps {
  selectedBlocks: string[];
  handleReset: () => void;
}

const SelectedTimeBlocks: React.FC<SelectedTimeBlocksProps> = ({
  selectedBlocks,
  handleReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = selectedBlocks.join("\n");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center basis-1/3 shrink-0">
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

export default SelectedTimeBlocks;
