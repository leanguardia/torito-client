"use client";

import { formatUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { getUSDTAddress } from "~~/utils/networkConfig";

/**
 * Hook to fetch USDT token balance for the connected wallet
 * Uses wagmi's useBalance hook with the USDT token address
 */
export function useUSDTBalance() {
  const { address: userAddress } = useAccount();
  const chainId = useChainId();

  const usdtAddress = getUSDTAddress(chainId);

  const {
    data: balance,
    isError,
    isLoading,
    refetch,
  } = useBalance({
    address: userAddress,
    token: usdtAddress,
    query: {
      enabled: !!userAddress, // Only fetch when user is connected
      refetchInterval: 5000, // Refetch every 5 seconds to watch for changes
    },
  });

  // Format balance to a readable number (USDT has 6 decimals)
  const formattedBalance = balance ? Number(formatUnits(balance.value, balance.decimals)) : 0;

  return {
    balance: formattedBalance,
    rawBalance: balance?.value,
    decimals: balance?.decimals,
    symbol: balance?.symbol,
    isLoading,
    isError,
    isConnected: !!userAddress,
    refetch,
  };
}
