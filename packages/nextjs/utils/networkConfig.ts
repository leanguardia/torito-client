export const NETWORK_CONFIG = {
  // Lisk mainnet
  1135: {
    usdt: "0x43F2376D5D03553aE72F4A8093bbe9de4336EB08", // USDT en Lisk
  },
  // Hardhat local
  31337: {
    usdt: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Primer contrato deployado en hardhat
  },
  // Ethereum mainnet (fallback)
  1: {
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
} as const;

export function getUSDTAddress(chainId: number): `0x${string}` {
  return (NETWORK_CONFIG as any)[chainId]?.usdt || NETWORK_CONFIG[1].usdt;
}
