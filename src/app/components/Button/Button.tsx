"use client";

import { ButtonProps } from "./Button.type";

function Button({ children, onClick, className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-yellow-200 hover:brightness-95 text-yellow-700 font-medium py-4 px-8 rounded-lg shadow-xl transition duration-300 cursor-pointer ease-in-out transform hover:scale-108 flex items-center ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
