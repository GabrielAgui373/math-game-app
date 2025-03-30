"use client";

import Button from "../Button/Button";
import { IconButtonProps } from "./IconButton.type";

export default function IconButton({ onClick, children }: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="!p-2 !rounded-full w-11 h-11 flex items-center justify-center"
    >
      {children}
    </Button>
  );
}
