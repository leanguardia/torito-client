"use client";

import { Country } from "~~/constants/countries";
import { onlyDecimal } from "~~/utils/number";

export function AmountRow({
  usdt,
  setUsdt,
  country,
  formattedLocal,
}: {
  usdt: string;
  setUsdt: (v: string) => void;
  country: Country;
  formattedLocal: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg">
            +
          </span>
        </div>
        <input
          inputMode="decimal"
          value={usdt}
          onChange={e => setUsdt(onlyDecimal(e.target.value))}
          placeholder="0.00"
          className="w-full pl-12 pr-16 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg bg-white text-gray-900"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 font-medium">USDT</div>
      </div>

      <div className="relative">
        <input
          readOnly
          value={usdt ? formattedLocal : ""}
          placeholder={`${country.symbol} 0.00`}
          className="w-full pl-4 pr-20 py-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-lg"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 font-medium">
          {country.symbol}
        </div>
      </div>
    </div>
  );
}
