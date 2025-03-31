"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button/Button";

export default function StartPage() {
  const router = useRouter();

  const handleStartGame = () => {
    router.push(`/gamer`);
  };

  return (
    <div className="flex flex-1 items-center justify-center ">
      <Button onClick={handleStartGame}>Start Game</Button>
    </div>
  );
}
