import { ChangeEvent, InputHTMLAttributes } from "react";

export interface InputTextProps {
  id: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  label?: string;
  type?: "text" | "number";
}
