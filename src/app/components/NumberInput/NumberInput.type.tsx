import { Dispatch, SetStateAction } from "react";

export interface NumberInputProps {
  onSubmit: (answer: number) => void;
  isCorrect: Boolean | null;
}
