"use client";

import { useState } from "react";
import { pad, parseUnits, stringToHex } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
// Importar el ABI específico de Torito
import ToritoABI from "~~/contracts/Torito-ABI.json";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

export function useBorrow() {
  const { address: userAddress } = useAccount();
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  const { data: toritoContract } = useScaffoldContract({
    contractName: "Torito",
  });

  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const borrow = async (collateralToken: string, borrowAmountFiat: string, fiatCurrency: string) => {
    if (!toritoContract?.address || !borrowAmountFiat || !userAddress || isBorrowing) return;

    try {
      setIsBorrowing(true);
      setLastTxHash(undefined);

      const amountToBorrow = parseUnits(borrowAmountFiat, 6);

      // Convertir la moneda fiat a bytes32 (alineado a la izquierda)
      const currencyBytes32 = pad(stringToHex(fiatCurrency), { dir: "right", size: 32 });

      // Usar el ABI específico de Torito para la función borrow

      //   console.log("contract info", {
      //     collateralToken,
      //     borrowAmountFiat,
      //     amountToBorrow,
      //     fiatCurrency,
      //     currencyBytes32
      //   })
      await writeContract({
        address: toritoContract.address,
        abi: ToritoABI,
        functionName: "borrow",
        args: [collateralToken, amountToBorrow, currencyBytes32],
      });

      setLastTxHash(hash);
    } catch (error) {
      console.error("Error en borrow:", error);
      setIsBorrowing(false);
      throw error;
    }
  };

  // Reset isBorrowing when transaction is confirmed or fails
  if (isBorrowing && (isConfirmed || writeError || confirmError)) {
    setIsBorrowing(false);
  }

  return {
    borrow,
    isBorrowing: isBorrowing || isWritePending || isConfirming,
    isConfirmed,
    error: writeError || confirmError,
    txHash: hash,
    lastTxHash,
  };
}
