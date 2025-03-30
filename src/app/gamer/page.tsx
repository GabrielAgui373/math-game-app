"use client";

import { useRef, useState } from "react";
import Timer from "../components/Timer/Timer";
import { useRouter } from "next/navigation";
import Expression from "../components/Expression/Expression";
import NumberInput from "../components/NumberInput/NumberInput";
import Statistics from "../components/Statistics/Statistics";
import { ArithmeticMathGame } from "../arithmetic";
import { useSettings } from "../components/shared/SettingsContext";
import useSound from "../hooks/useSound";

interface GameSessionResults {
  score: number;
  correctAnswers: number;
  timestamp?: number;
}

export default function GamerPage() {
  const router = useRouter();

  const gameRef = useRef(new ArithmeticMathGame());
  const [problem, setProblem] = useState(gameRef.current.getCurrentProblem());
  const [stats, setStats] = useState(gameRef.current.getCurrentStats());

  const { play: playCorrectSound, isLoaded: correctSoundLoaded } = useSound(
    "/sounds/correct-answer.wav"
  );

  const { play: playWrongSound, isLoaded: wrongSoundLoaded } = useSound(
    "/sounds/wrong-answer.mp3"
  );

  const [isCorrect, setIsCorrect] = useState<Boolean | null>(null);
  const { settings } = useSettings();

  const playSound = async (play: () => void) => {
    if (settings.soundEnabled) {
      await play();
    }
  };

  const handleSubmit = async (answer: number) => {
    const currentGame = gameRef.current;

    if (currentGame.checkAnswer(answer)) {
      await playSound(playCorrectSound);

      setProblem(currentGame.getCurrentProblem());
      setStats(currentGame.getCurrentStats());
      setIsCorrect(true);
    } else {
      await playSound(playWrongSound);

      setStats(currentGame.getCurrentStats());
      setIsCorrect(false);
    }
  };

  const saveGameResult = () => {
    const stats = gameRef.current.getCurrentStats();

    const gameResult: GameSessionResults = {
      score: stats.score,
      correctAnswers: stats.correctAnswers,
      timestamp: Date.now(),
    };

    // Salva/sobrescreve o resultado no sessionStorage
    sessionStorage.setItem("currentGameResult", JSON.stringify(gameResult));
  };

  const handleTimerEnd = () => {
    saveGameResult();
    router.push("/game-over");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md ">
        <div className="w-full  p-6 space-y-6">
          <Timer duration={settings.timeInSeconds} onEnd={handleTimerEnd} />
          <Expression expression={problem.expression} />
          <NumberInput onSubmit={handleSubmit} isCorrect={isCorrect} />

          <Statistics
            score={stats.score}
            level={stats.level}
            correctAnswers={stats.correctAnswers}
          />
        </div>
      </div>
    </div>
  );
}
