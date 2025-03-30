"use client";

import { useEffect, useState } from "react";
import { TimeProps } from "./Timer.types";

function Timer({ duration, onEnd }: TimeProps) {
  const [progress, setProgress] = useState(100);

  const totalSeconds = (duration * progress) / 100;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const v = Math.max(prev - 100 / duration, 0);
        if (v == 0) {
          onEnd();
        }

        return v;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="w-full  relative">
      <div className="w-full  bg-blue-800 rounded-full h-5 overflow-hidden">
        <div
          className="bg-yellow-300 h-5 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div
        className="absolute top-0 -translate-y-[120%] left-0 transition-all duration-1000"
        style={{ left: `${progress}%` }}
      >
        <div className="bg-yellow-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform -translate-x-1/2">
          <span className="text-sm font-bold text-yellow-700">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Timer;
