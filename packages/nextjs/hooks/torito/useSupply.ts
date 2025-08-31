"use client";

import { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
// Importar el ABI específico de Torito
import ToritoABI from "~~/contracts/Torito-ABI.json";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { getUSDTAddress } from "~~/utils/networkConfig";

// ABI mínimo para USDT (ERC20)
const ERC20_ABI = [
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export function useSupply() {
  const { address: userAddress } = useAccount();
  const chainId = useChainId();
  const [isSupplying, setIsSupplying] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  const usdtAddress = getUSDTAddress(chainId);

  const { data: toritoContract } = useScaffoldContract({
    contractName: "Torito",
  });

  // Leer allowance actual
  const { data: allowance } = useReadContract({
    address: usdtAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: userAddress && toritoContract?.address ? [userAddress, toritoContract.address] : undefined,
  });

  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (usdtAmount: string) => {
    if (!toritoContract?.address || !usdtAmount) return;

    const amount = parseUnits(usdtAmount, 6);

    await writeContract({
      address: usdtAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [toritoContract.address, amount],
    });
  };

  const supply = async (usdtAmount: string) => {
    if (!toritoContract?.address || !usdtAmount || isSupplying) return;

    try {
      setIsSupplying(true);
      setLastTxHash(undefined);

      // Convertir el monto a wei (USDT tiene 6 decimales)
      const amount = parseUnits(usdtAmount, 6);

      // Usar el ABI específico de Torito para la función supply
      await writeContract({
        address: toritoContract.address,
        abi: ToritoABI,
        functionName: "supply",
        args: [usdtAddress, amount],
      });

      setLastTxHash(hash);
    } catch (error) {
      console.error("Error en supply:", error);
      setIsSupplying(false);
      throw error;
    }
  };

  // Verificar si necesita approval
  const needsApproval = (usdtAmount: string) => {
    if (!allowance || !usdtAmount) return true;
    const amount = parseUnits(usdtAmount, 6);
    return (allowance as bigint) < amount;
  };

  // Reset isSupplying when transaction is confirmed or fails
  if (isSupplying && (isConfirmed || writeError || confirmError)) {
    setIsSupplying(false);
  }

  return {
    supply,
    approve,
    needsApproval,
    isSupplying: isSupplying || isWritePending || isConfirming,
    isConfirmed,
    error: writeError || confirmError,
    txHash: hash,
    lastTxHash,
    allowance: allowance as bigint,
  };
}
