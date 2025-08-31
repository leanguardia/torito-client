"use client";

import { useState } from "react";
import { COUNTRIES } from "~~/constants/countries";

export function CountrySelect({
  countryId,
  onSelect,
  formatRate,
}: {
  countryId: string;
  onSelect: (id: string) => void;
  formatRate: (n: number) => string;
}) {
  const [open, setOpen] = useState(false);
  const active = COUNTRIES.find(c => c.id === countryId)!;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary flex items-center justify-between"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl leading-none">{active.flag}</span>
          <span className="font-medium">{active.name}</span>
        </span>
        <span className="text-gray-500">⌄</span>
      </button>

      {open && (
        <ul className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-64 overflow-auto">
          {COUNTRIES.map(c => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(c.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 ${
                  c.id === countryId ? "bg-gray-50" : ""
                }`}
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <span className="flex-1">{c.name}</span>
                <span className="text-gray-600 text-sm">
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
