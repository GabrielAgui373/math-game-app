"use client";

import { InputTextProps } from "./InputText.type";

export default function InputText({
  id,
  onChange,
  onBlur,
  label,
  type = "text",
  value,
}: InputTextProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={1}
        step={1}
        className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
}
