"use client";

import { useRouter } from "next/navigation";
import { HiOutlineHome } from "react-icons/hi";
import IconButton from "../components/IconButton/IconButton";
import { MdReplay } from "react-icons/md";
import { useEffect, useState } from "react";

interface GameResult {
  score: number;
  correctAnswers: number;
  timestamp?: number;
}

export default function GameOver() {
  const router = useRouter();
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [bestResult, setBestResult] = useState<GameResult | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    // Recupera os resultados da sessão atual
    const sessionResult = sessionStorage.getItem("currentGameResult");
    const parsedSessionResult: GameResult | null = sessionResult
      ? JSON.parse(sessionResult)
      : null;
    setCurrentResult(parsedSessionResult);

    // Recupera o melhor resultado armazenado
    const storedBestResult = localStorage.getItem("gameBestResults");
    let parsedBestResult: GameResult | null = storedBestResult
      ? JSON.parse(storedBestResult)
      : null;

    // Verifica se é um novo recorde
    if (
      parsedSessionResult &&
      (!parsedBestResult || parsedSessionResult.score > parsedBestResult.score)
    ) {
      setIsNewRecord(true);
      // Atualiza o melhor resultado
      parsedBestResult = {
        score: parsedSessionResult.score,
        correctAnswers: parsedSessionResult.correctAnswers,
        timestamp: Date.now(),
      };
      localStorage.setItem("gameBestResults", JSON.stringify(parsedBestResult));
    }

    setBestResult(parsedBestResult);
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="  max-w-sm w-screen p-4 flex flex-col gap-5 justify-center">
        <h1 className="  text-center text-3xl font-semibold text-white">
          Game Over
        </h1>

        <div className="flex gap-3 ">
          <div className=" bg-blue-800 w-full flex flex-col p-3 rounded-xl border-2  border-white">
            <span className="text-white font-semibold">
              {isNewRecord ? "Best Score!" : "Your Score"}
            </span>
            <span className="text-white font-bold text-2xl">
              {currentResult?.score || 0}
            </span>
          </div>
          <div className=" bg-blue-800 w-full flex flex-col p-3 rounded-xl border-2 border-white">
            <span className="text-white font-semibold">correct Answers</span>
            <span className="text-white font-bold text-2xl">
              {currentResult?.correctAnswers || 0}
            </span>
          </div>
        </div>

        {!isNewRecord && bestResult && (
          <div className="bg-blue-800 flex flex-col p-3 rounded-xl border-2 border-white w-full gap-2">
            <span className="text-white font-semibold">Best</span>
            <span className="text-white font-bold text-xl">
              Score: {bestResult.score}
            </span>
            <span className="text-white font-bold text-xl">
              Correct Anwers: {bestResult.correctAnswers}
            </span>
          </div>
        )}

        <div className="w-full flex items-center justify-center p-2 gap-3">
          <IconButton
            onClick={() => {
              router.push("/");
            }}
          >
            <HiOutlineHome size={24} />
          </IconButton>

          <IconButton
            onClick={() => {
              router.push("/gamer");
            }}
          >
            <MdReplay size={24} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
