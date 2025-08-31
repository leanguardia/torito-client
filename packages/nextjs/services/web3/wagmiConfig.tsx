import { createConfig } from "wagmi";
import * as chains from "viem/chains";
import { transports, wagmiConnectors } from "~~/services/web3/wagmiConnectors";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const targetNetworks = getTargetNetworks();

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
const enabledChains = targetNetworks.find(network => network.id === 1)
  ? targetNetworks
  : [...targetNetworks, chains.mainnet];

export const wagmiConfig = createConfig({
  chains: enabledChains as any,
  connectors: wagmiConnectors,
  transports,
});
