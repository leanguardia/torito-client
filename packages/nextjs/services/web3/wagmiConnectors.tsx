import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {

  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from "viem";
import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const targetNetworks = getTargetNetworks();

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find(network => network.id === 1)
  ? targetNetworks
  : [...targetNetworks, chains.mainnet];

/**
 * Transports for the app
 */
export const transports = enabledChains.reduce((acc, chain) => {
  if (chain.id === chains.mainnet.id) {
    acc[chain.id] = http(`https://eth-mainnet.alchemyapi.io/v2/${scaffoldConfig.alchemyApiKey}`);
  } else {
    acc[chain.id] = http(chain.rpcUrls.default.http[0]);
  }
  return acc;
}, {} as Record<number, ReturnType<typeof http>>);



/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets: [
        metaMaskWallet,
      ],
    },
  ],
  {
    appName: "scaffold-eth-2",
    projectId: scaffoldConfig.walletConnectProjectId,
  },
);
