"use client";

import { formatUnits } from "viem";
import { useAccount, useChainId, useReadContract } from "wagmi";
import ToritoABI from "~~/contracts/Torito-ABI.json";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { getUSDTAddress } from "~~/utils/networkConfig";

export function useSupplyBalance() {
  const { address: userAddress } = useAccount();
  const chainId = useChainId();

  const usdtAddress = getUSDTAddress(chainId);

  const { data: toritoContract } = useScaffoldContract({
    contractName: "Torito",
  });

  // Leer el supply del usuario desde el mapping supplies[user][token]
  const {
    data: supplyData,
    isError,
    isLoading,
    refetch,
  } = useReadContract({
    address: toritoContract?.address,
    abi: ToritoABI,
    functionName: "supplies",
    args: userAddress && usdtAddress ? [userAddress, usdtAddress] : undefined,
    query: {
      enabled: !!userAddress && !!usdtAddress && !!toritoContract?.address,
    },
  });

  // Extraer los datos del supply
  const supplyInfo = supplyData as
    | [string, bigint, string, string, number] // [owner, shares, token, borrowFiatCurrency, status]
    | undefined;

  const hasSupply = supplyInfo && supplyInfo[1] > 0n; // shares > 0
  const shares = supplyInfo ? supplyInfo[1] : 0n;
  const formattedShares = formatUnits(shares, 18); // Los shares usan 18 decimales

  return {
    supplyData: supplyInfo,
    shares,
    formattedShares,
    hasSupply,
    isLoading,
    isError,
    refetch,
  };
}
