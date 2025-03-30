"use client";

import { ScoreProps } from "./Statistics.type";

function Statistics({ score, level, correctAnswers }: ScoreProps) {
  return (
    <div className="w-full  flex gap-5 items-center justify-center text-white">
      <div className="flex items-center gap-2">
        <span>Score: {score}</span>
      </div>

      <div className="flex items-center gap-2">
        <span>Level: {level}</span>
      </div>

      <div className="flex items-center gap-2">
        <span>Answer: {correctAnswers}</span>
      </div>
    </div>
  );
}

export default Statistics;
