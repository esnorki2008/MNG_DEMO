import React from "react";

interface LineBarProps {
  title: string;
}

const LineBar: React.FC<LineBarProps> = ({ title }) => {
  return (
    <div className="bg-indigo-600 text-white p-4 flex space-x-4 items-center">
      <h1>{title}</h1>
    </div>
  );
};

export default LineBar;
