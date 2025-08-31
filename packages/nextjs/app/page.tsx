"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { AmountRow } from "~~/components/torito/AmountRow";
import { BalancePill } from "~~/components/torito/BalancePill";
import { CountrySelect } from "~~/components/torito/CountrySelect";
import { useDeposit } from "~~/hooks/torito/useDeposit";
import { useSupply } from "~~/hooks/torito/useSupply";
import { fmt } from "~~/utils/number";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { countryId, setCountryId, country, usdt, setUsdt, usdtNum, localAmount, loanAmount } = useDeposit();
  const { supply, approve, needsApproval, isSupplying, isConfirmed, error: supplyError } = useSupply();

  const walletUsdtBalance = 0;

  const [alert, setAlert] = useState<null | { type: "success" | "error"; text: string }>(null);

  // Efecto para manejar confirmaciones de transacción
  useEffect(() => {
    if (isConfirmed) {
      setAlert({
        type: "success",
        text: "¡Depósito confirmado exitosamente en la blockchain!",
      });
      setTimeout(() => setAlert(null), 5000);
    }
  }, [isConfirmed]);

  // Efecto para manejar errores de transacción
  useEffect(() => {
    if (supplyError) {
      setAlert({
        type: "error",
        text: "Error en la transacción. Verifica tu saldo de USDT y allowance.",
      });
    }
  }, [supplyError]);

  const onSend = async () => {
    if (usdtNum <= 0 || isSupplying) return;

    const sentUsdt = usdtNum;
    const sentLocal = localAmount;

    try {
      setAlert(null);

      if (needsApproval(usdt)) {
        // Primero necesita approve
        await approve(usdt);
        setAlert({
          type: "success",
          text: `Aprobación enviada. Después podrás hacer el depósito de ${fmt(sentUsdt)} USDT.`,
        });
      } else {
        // Puede hacer supply directamente
        await supply(usdt);
        setUsdt("");
        setAlert({
          type: "success",
          text: `Transacción enviada. Depositando ${fmt(sentUsdt)} USDT (~ ${country.symbol} ${fmt(sentLocal)}).`,
        });
      }
    } catch (error) {
      console.error("Error en supply:", error);
      setAlert({
        type: "error",
        text: "No se pudo enviar la transacción. Verifica tu conexión y saldo.",
      });
    }
  };

  return (
    <section className="flex items-center flex-col flex-grow pt-10 w-full min-h-screen bg-base-100">
      <div className="px-5 flex flex-col gap-6 items-center w-full">
        <h1 className="text-center max-w-4xl leading-tight text-base-content">
          <span className="block text-5xl md:text-6xl font-extrabold">
            Protegemos tus finanzas
            <br className="hidden md:block" /> cuando la economía colapsa
          </span>
        </h1>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-700">Connected Address:</span>
          <Address address={connectedAddress} />
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <BalancePill label="Tu balance de USDT (wallet):" value={`${fmt(walletUsdtBalance)} USDT`} />
          <BalancePill label="Tu balance en Torito:" skeleton />
        </div>
      </div>

      <div className="w-full max-w-4xl mt-8 px-5">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-base-content">Depositar</h2>
          {alert && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 flex items-center gap-2 ${
                alert.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5" />
              )}
              <span className="text-sm">{alert.text}</span>
              <button onClick={() => setAlert(null)} className="ml-auto btn btn-ghost btn-xs">
                ✕
              </button>
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
          <CountrySelect countryId={countryId} onSelect={setCountryId} formatRate={n => fmt(n)} />

          <label className="block text-sm font-medium text-gray-700 mb-2 mt-8">Monto en USDT</label>
          <AmountRow usdt={usdt} setUsdt={setUsdt} country={country} formattedLocal={fmt(localAmount)} />

          <p className="text-sm text-gray-500 mt-2 mb-6">
            1&nbsp;USDT = {country.symbol}&nbsp;{fmt(country.rate)} {country.code}
          </p>

          <div className="mt-6">
            {usdtNum <= 0 ? (
              <div className="w-full rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-center text-gray-600">
                Ingresa un monto para ver cuánto podrías prestarte.
              </div>
            ) : (
              <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-center text-amber-900">
                Podrías prestarte:{" "}
                <strong>
                  {country.symbol} {fmt(loanAmount)}
                </strong>{" "}
                (50% de tu depósito convertido)
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={onSend}
              disabled={usdtNum <= 0 || isSupplying}
              className={`w-full md:w-auto rounded-xl px-6 py-3 font-semibold shadow-sm border transition-colors ${
                usdtNum > 0 && !isSupplying
                  ? "btn btn-primary text-white"
                  : "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
              }`}
            >
              {isSupplying ? <span className="loading loading-spinner loading-sm mr-2" /> : null}
              {usdtNum > 0 && needsApproval(usdt) ? "Aprobar USDT" : "Enviar"}
            </button>
          </div>
        </div>
      </div>

      <div className="h-10" />
    </section>
  );
};

export default Home;
