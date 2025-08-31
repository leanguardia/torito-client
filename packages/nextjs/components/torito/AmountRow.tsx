"use client";

import { Country } from "~~/constants/countries";
import { onlyDecimal } from "~~/utils/number";

export function DepositBorrowCalculator({
  usdt,
  setUsdt,
  country,
  formattedLocal,
  loanAmount,
  fmt,
  validationError,
}: {
  usdt: string;
  setUsdt: (v: string) => void;
  country: Country;
  formattedLocal: string;
  loanAmount: number;
  fmt: (n: number, locale?: string, decimals?: number) => string;
  validationError?: string | null;
}) {
  const usdtNum = Number(usdt || 0);
  const hasError = validationError && usdt;

  return (
    <div className="space-y-4">
      {/* USDT Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">💰 Deposita USDT</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-lg font-bold ${
                hasError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              }`}
            >
              {hasError ? "!" : "+"}
            </span>
          </div>
          <input
            inputMode="decimal"
            value={usdt}
            onChange={e => setUsdt(onlyDecimal(e.target.value))}
            placeholder="0.00"
            className={`w-full pl-12 pr-16 py-4 rounded-xl border-2 outline-none text-xl bg-white text-gray-900 font-semibold transition-colors ${
              hasError
                ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            }`}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 font-bold">USDT</div>
        </div>

        {/* Validation Error Message */}
        {hasError && (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            {validationError}
          </div>
        )}
      </div>

      {/* Borrow Preview */}
      {usdtNum > 0 && !hasError ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
          <div className="text-center space-y-2">
            <div className="text-sm font-medium text-green-700">🎯 Podrás prestarte HOY (después de confirmar):</div>
            <div className="text-3xl font-bold text-green-800">
              {country.symbol} {fmt(loanAmount)}
            </div>
            <div className="text-sm text-green-600">= {fmt(usdtNum / 2)} USDT al 50% de tu depósito</div>
            <div className="text-xs text-green-500 bg-green-100 px-3 py-1 rounded-full inline-block">
              ✅ Sin perder tus dólares originales
            </div>
          </div>
        </div>
      ) : !usdt || usdt === "0" ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-gray-500">
          <div className="text-sm">💡 Ingresa un monto para ver cuánto podrás prestarte</div>
        </div>
      ) : hasError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-600">
          <div className="text-sm">🚫 Corrige los errores para continuar</div>
        </div>
      ) : null}

      {/* Local Currency Equivalent */}
      {usdtNum > 0 && !hasError && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="text-center text-sm text-blue-700">
            <span className="font-medium">Tu depósito equivale a:</span>{" "}
            <span className="font-bold">
              {country.symbol} {formattedLocal}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
