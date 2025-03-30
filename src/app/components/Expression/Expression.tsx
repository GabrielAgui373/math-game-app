"use client";

import { ExpressionProps } from "./Expression.type";

function Expression({ expression }: ExpressionProps) {
  return (
    <div
      className=" w-full max-w-full
      overflow-x-auto sm:overflow-x-visible  
      py-2"
    >
      <div
        className="
        flex flex-wrap 
        justify-center 
        items-baseline 
        gap-1 sm:gap-2
        text-4xl lg:text-5xl
        whitespace-nowrap 
      "
      >
        {expression.split(" ").map((part, index) => (
          <span key={index} className="inline-block font-bold text-white">
            {part}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Expression;
