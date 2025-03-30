"use client";

import { useEffect, useRef, useState } from "react";
import { NumberInputProps } from "./NumberInput.type";

function NumberInput({ onSubmit, isCorrect }: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userAnswer, setUserAnswer] = useState("");

  // Foca automaticamente no input ao carregar o componente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Garante que o input nunca perca o foco
  useEffect(() => {
    const handleBlur = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("blur", handleBlur); // Adiciona o listener de blur
    }

    // Limpa o listener ao desmontar o componente
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSubmit(Number(userAnswer));
      setUserAnswer("");
    }
  }

  return (
    <div className="w-full flex justify-center">
      <input
        value={userAnswer}
        ref={inputRef}
        onChange={(e) => {
          // Aceita apenas números
          const value = e.target.value.replace(/[^0-9]/g, "");
          setUserAnswer(value);
        }}
        onKeyDown={handleKeyDown}
        inputMode="numeric" // Teclado numérico em dispositivos móveis
        className={`py-2 px-2 w-35 max-w-xs text-center text-white font-medium text-5xl bg-blue-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 ${
          isCorrect != null &&
          (isCorrect ? "focus:ring-green-400" : "focus:ring-red-400")
        }  placeholder:text-white caret-transparent transition`}
        placeholder="0"
      />
    </div>
  );
}

export default NumberInput;
