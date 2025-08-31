export const NETWORK_CONFIG = {
  // Lisk mainnet
  1135: {
    usdt: "0x05D032ac25d322df992303dCa074EE7392C117b9", // USDT en Lisk
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
