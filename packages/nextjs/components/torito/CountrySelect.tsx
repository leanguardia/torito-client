"use client";

import { useState } from "react";
import { COUNTRIES } from "~~/constants/countries";

type Props = {
  countryId: string;
  onSelect: (id: string) => void;
  formatRate: (n: number) => string;
};

export function CountrySelect({ countryId, onSelect, formatRate }: Props) {
  const [open, setOpen] = useState(false);
  const active = COUNTRIES.find(c => c.id === countryId) ?? COUNTRIES[0];
  if (!active) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:border-gray-300 transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl leading-none">{active.flag}</span>
          <span className="font-semibold text-lg">{active.name}</span>
        </span>
        <span className="text-gray-400 text-xl">⌄</span>
      </button>

      {open && (
        <ul className="absolute z-20 mt-3 w-full rounded-2xl border-2 border-gray-200 bg-white shadow-xl max-h-72 overflow-auto">
          {COUNTRIES.map(c => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(c.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-5 py-4 hover:bg-blue-50 flex items-center gap-3 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                  c.id === countryId ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <span className="flex-1 font-medium">{c.name}</span>
                <span className="text-gray-600 text-sm font-semibold">
                  {c.symbol} {formatRate(c.rate)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
