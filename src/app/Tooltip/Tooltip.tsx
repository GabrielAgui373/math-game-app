import { useState } from "react";
import { TooltipProps } from "./Tooltip.type";

export default function Tooltip({
  children,
  content,
  position = "top",
  delay = 700,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Evita que eventos de clique propaguem
        }}
        className="inline-block cursor-default" // cursor-default para evitar comportamento de clique
        tabIndex={-1} // Remove a capacidade de focar via teclado
      >
        {children}
      </div>

      <div
        role="tooltip"
        className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm ${
          positionClasses[position]
        } whitespace-nowrap transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ width: "fit-content" }}
      >
        {content}
        <div
          className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" : ""
          }${
            position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" : ""
          }${
            position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" : ""
          }${
            position === "right" ? "left-[-4px] top-1/2 -translate-y-1/2" : ""
          }`}
        />
      </div>
    </div>
  );
}
