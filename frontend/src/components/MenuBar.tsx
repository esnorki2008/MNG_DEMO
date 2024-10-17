import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  handler: string;
  title: string;
  icon: IconDefinition;
}

interface MenuBarProps {
  title: string;
  items: MenuItem[];
}

const MenuBar: React.FC<MenuBarProps> = ({ items, title }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-indigo-600 text-white p-4 flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-4">
      <h1 className="text-lg font-bold mb-2 sm:mb-0">{title}</h1>
      {items.map((item, index) => (
        <button
          key={index}
          className="flex items-center space-x-2 hover:bg-indigo-500 px-3 py-2 rounded bg-indigo-700 w-full sm:w-auto"
          onClick={() => navigate(item.handler)}
        >
          <FontAwesomeIcon icon={item.icon} />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
};

export default MenuBar;
