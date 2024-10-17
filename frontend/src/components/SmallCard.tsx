import React from "react";

interface SmallCardProps {
  title: string;
  description: string;
  color?: "red" | "yellow" | "green" | "gray";
  onClick?: () => void;
}

const SmallCard: React.FC<SmallCardProps> = ({
  title,
  description,
  color = "gray",
  onClick,
}) => {
  const borderColorClass =
    {
      red: "border-red-500",
      yellow: "border-yellow-500",
      green: "border-green-500",
      gray: "border-gray-500",
    }[color] || "border-gray-500";

  return (
    <div
      onClick={onClick}
      className={`relative max-w-xs bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100 hover:opacity-90 transition-opacity duration-300 ease-in-out border-r-4 ${borderColorClass}`}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default SmallCard;
