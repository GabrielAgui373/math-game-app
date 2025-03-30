"use client";

import { useCallback, useEffect, useState } from "react";
import IconButton from "../IconButton/IconButton";
import { FaCompress, FaExpand } from "react-icons/fa";
import { HiOutlineCog } from "react-icons/hi";
import ConfigDialog from "../ConfigDialog/ConfigDialog";
import { usePathname } from "next/navigation";

// Paths where the config button should be hidden
const HIDDEN_BUTTON_PATHS = new Set(["/gamer", "/game-over"]);

export default function TopButtons() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const pathName = usePathname();

  // Memoized fullscreen toggle handler
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  // Effect to track fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    // Add both standard and webkit events for better browser compatibility
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  // Check if config button should be hidden for current path
  const shouldHideConfigButton = HIDDEN_BUTTON_PATHS.has(pathName);

  return (
    <div className="absolute top-6 right-6 flex gap-3">
      {/* Fullscreen toggle button */}
      <IconButton
        onClick={handleToggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
      </IconButton>

      {/* Config button (hidden on specific paths) */}
      {!shouldHideConfigButton && (
        <IconButton
          onClick={() => setIsConfigDialogOpen(true)}
          aria-label="Open settings"
        >
          <HiOutlineCog size={25} />
        </IconButton>
      )}

      {/* Config dialog/modal */}
      <ConfigDialog
        isOpen={isConfigDialogOpen}
        onClose={() => setIsConfigDialogOpen(false)}
      />
    </div>
  );
}
