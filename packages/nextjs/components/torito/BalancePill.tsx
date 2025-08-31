"use client";

import { ReactNode } from "react";

export function BalancePill({ label, value, skeleton }: { label: ReactNode; value?: string; skeleton?: boolean }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-100">
      <span className="text-base text-gray-700">{label}</span>
      {skeleton ? (
        <span className="inline-block h-4 w-20 rounded-full bg-gray-200" />
      ) : (
        <span className="text-base font-semibold text-gray-800">{value}</span>
      )}
    </div>
  );
}
