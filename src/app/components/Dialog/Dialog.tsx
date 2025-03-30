"use client";

import { useEffect, useState } from "react";
import { DialogProps } from "./Dialog.type";
import { MdClose } from "react-icons/md";

export default function Dialog({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  title,
}: DialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={`fixed inset-0 transition duration-200 ${
          isVisible
            ? "bg-transparent bg-opacity-50 backdrop-blur-[2px]"
            : "bg-opacity-0"
        }`}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className={`transform flex flex-col gap-2 overflow-hidden p-5 rounded-lg bg-white text-left shadow-xl transition-all duration-200 w-full max-w-md ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div
            className={`flex  ${
              title ? "justify-between" : "justify-end"
            } items-center `}
          >
            {title && (
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            )}

            <button
              type="button"
              className="p-2 rounded-full w-11 h-11 flex items-center justify-center text-gray-400 focus:outline-none cursor-pointer hover:bg-gray-100 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
              aria-label="Fechar"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
