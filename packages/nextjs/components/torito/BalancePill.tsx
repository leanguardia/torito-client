"use client";

export function BalancePill({ label, value, skeleton }: { label: string; value?: string; skeleton?: boolean }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
      <span className="text-sm text-gray-700">{label}</span>
      {skeleton ? (
        <span className="inline-block h-3 w-16 rounded-full bg-gray-200" />
      ) : (
        <span className="text-sm font-semibold text-gray-800">{value}</span>
      )}
    </div>
  );
}
