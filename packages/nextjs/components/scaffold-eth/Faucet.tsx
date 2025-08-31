"use client";

import { useState } from "react";
import { useNetwork } from "wagmi";
import { ArrowUpTrayIcon, BanknotesIcon, BuildingLibraryIcon, QrCodeIcon } from "@heroicons/react/24/outline";

const MAX_LOAN_BS = 5000;
type DestType = "bank" | "qr";

export const Faucet = () => {
  const { chain } = useNetwork();
  const isLocal = chain?.id === 31337;
  if (!isLocal) return null;
  return <FaucetInner />;
};

const FaucetInner = () => {
  const [loanOpen, setLoanOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amountBs, setAmountBs] = useState<string>("");
  const [destType, setDestType] = useState<DestType>("bank");

  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrText, setQrText] = useState("");

  const available = MAX_LOAN_BS;
  const amountNum = Number(amountBs || 0);

  const canSubmit =
    amountNum > 0 &&
    amountNum <= available &&
    (destType === "bank" ? bankAccount.trim().length > 0 : qrFile !== null || qrText.trim().length > 0);

  const fmt = (n: number) => new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(n);

  const openResultAndReset = () => {
    setLoanOpen(false);
    setTimeout(() => setResultOpen(true), 150);
  };

  const solicitarPrestamo = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 900));
      setLoading(false);
      openResultAndReset();
      setAmountBs("");
      setBankName("");
      setBankAccount("");
      setQrFile(null);
      setQrText("");
    } catch (e) {
      setLoading(false);
      console.error("Solicitar préstamo error:", e);
    }
  };

  const onChangeAmount = (v: string) => {
    const clean = v.replace(/[^0-9.]/g, "");
    const n = Number(clean || 0);
    const clamped = Math.min(n, available);
    setAmountBs(clean === "" ? "" : String(clamped));
  };

  return (
    <div>
      <button onClick={() => setLoanOpen(true)} className="btn btn-primary btn-sm font-normal gap-1">
        <BanknotesIcon className="h-4 w-4" />
        <span>Préstamo</span>
      </button>
      <input
        type="checkbox"
        className="modal-toggle"
        checked={loanOpen}
        onChange={e => setLoanOpen(e.target.checked)}
      />
      <div className="modal">
        <div className="modal-box relative">
          <button onClick={() => setLoanOpen(false)} className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold m-0">Préstamo</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Puedes prestarte hasta <strong>{fmt(MAX_LOAN_BS)} Bs</strong> con tu saldo actual.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuánto quieres solicitar?</label>
            <div className="relative">
              <input
                inputMode="decimal"
                value={amountBs}
                onChange={e => onChangeAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-4 pr-20 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 font-medium">Bs</div>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Disponible: <strong>{fmt(available)} Bs</strong>
            </div>
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">¿Dónde quieres recibir el dinero?</label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setDestType("bank")}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left ${
                  destType === "bank" ? "border-primary/60 bg-primary/5" : "border-gray-200 bg-white"
                }`}
              >
                <BuildingLibraryIcon className="h-5 w-5" />
                <div className="leading-tight">
                  <div className="font-medium">Cuenta bancaria (Bolivia)</div>
                  <div className="text-xs text-gray-500">Depósito a tu cuenta local</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDestType("qr")}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left ${
                  destType === "qr" ? "border-primary/60 bg-primary/5" : "border-gray-200 bg-white"
                }`}
              >
                <QrCodeIcon className="h-5 w-5" />
                <div className="leading-tight">
                  <div className="font-medium">Importar QR</div>
                  <div className="text-xs text-gray-500">Envía a una cuenta por QR</div>
                </div>
              </button>
            </div>

            {destType === "bank" ? (
              <div className="space-y-3">
                <input
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="Banco (opcional)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <input
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value.replace(/[^\d\-]/g, ""))}
                  placeholder="Número de cuenta"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 px-4 py-3 bg-gray-50">
                  <span className="flex items-center gap-2 text-gray-700">
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    {qrFile ? (
                      <span className="truncate max-w-[220px]">{qrFile.name}</span>
                    ) : (
                      <span>Subir imagen del QR (PNG/JPG)</span>
                    )}
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={e => setQrFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                <textarea
                  value={qrText}
                  onChange={e => setQrText(e.target.value)}
                  placeholder="Pega aquí los datos del QR (opcional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <p className="text-xs text-gray-500">
                  Puedes subir el QR o pegar sus datos. Con uno de los dos es suficiente.
                </p>
              </div>
            )}
          </div>
          <div className="mt-5">
            <button onClick={solicitarPrestamo} disabled={!canSubmit || loading} className="btn btn-primary w-full">
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <BanknotesIcon className="h-5 w-5" />
              )}
              <span>Solicitar préstamo</span>
            </button>
            {!canSubmit && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                Ingresa un monto válido y el destino para continuar.
              </p>
            )}
          </div>
        </div>
      </div>

      <input
        type="checkbox"
        className="modal-toggle"
        checked={resultOpen}
        onChange={e => setResultOpen(e.target.checked)}
      />
      <div className="modal">
        <div className="modal-box relative">
          <button
            onClick={() => setResultOpen(false)}
            className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3"
          >
            ✕
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <BanknotesIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold m-0">Solicitud en proceso</h3>
            </div>

            <p className="text-gray-600">
              Tu solicitud está en proceso. Te notificaremos a tu correo cuando el dinero haya sido enviado.
            </p>

            <button onClick={() => setResultOpen(false)} className="btn btn-primary w-full">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
