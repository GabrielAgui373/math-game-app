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
  const [needsWrap, setNeedsWrap] = useState(false);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
      // Verifica se o tooltip está saindo da tela
      checkTooltipWidth();
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const checkTooltipWidth = () => {
    // Espera um frame para o tooltip ser renderizado
    requestAnimationFrame(() => {
      const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement;
      if (tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        // Verifica se o tooltip está saindo da viewport
        const isOverflowing =
          tooltipRect.right > window.innerWidth || tooltipRect.left < 0;
        setNeedsWrap(isOverflowing);
      }
    });
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
          e.stopPropagation();
        }}
        className="inline-block cursor-default"
        tabIndex={-1}
      >
        {children}
      </div>

      <div
        role="tooltip"
        className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm ${
          positionClasses[position]
        } transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${
          needsWrap
            ? "whitespace-normal break-words max-w-xs"
            : "whitespace-nowrap"
        }`}
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
