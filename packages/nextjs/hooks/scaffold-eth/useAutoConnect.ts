import { useEffectOnce, useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { Chain } from "viem/chains";
import { Connector, useAccount, useConnect } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const SCAFFOLD_WALLET_STORAGE_KEY = "scaffoldEth2.wallet";
const WAGMI_WALLET_STORAGE_KEY = "wagmi.wallet";

// ID of the SAFE connector instance
const SAFE_ID = "safe";

/**
 * This function will get the initial wallet connector (if any), the app will connect to
 * @param initialNetwork
 * @param previousWalletId
 * @param connectors
 * @returns
 */
const getInitialConnector = (
  initialNetwork: Chain,
  previousWalletId: string,
  connectors: readonly Connector[],
): { connector: Connector | undefined; chainId?: number } | undefined => {
  // Look for the SAFE connector instance and connect to it instantly if loaded in SAFE frame
  const safeConnectorInstance = connectors.find(connector => connector.id === SAFE_ID && connector.ready);

  if (safeConnectorInstance) {
    return { connector: safeConnectorInstance };
  }

  // If user has a previous wallet and auto-connect is enabled, try to reconnect
  if (previousWalletId && scaffoldConfig.walletAutoConnect) {
    const connector = connectors.find(f => f.id === previousWalletId);
    return { connector };
  }

  return undefined;
};

/**
 * Automatically connect to a wallet/connector based on config and prior wallet
 */
export const useAutoConnect = (): void => {
  const wagmiWalletValue = useReadLocalStorage<string>(WAGMI_WALLET_STORAGE_KEY);
  const [walletId, setWalletId] = useLocalStorage<string>(SCAFFOLD_WALLET_STORAGE_KEY, wagmiWalletValue ?? "", {
    initializeWithValue: false,
  });
  const connectState = useConnect();
  const { connector } = useAccount();
  
  // Update wallet ID when connected
  useEffectOnce(() => {
    if (connector?.id) {
      setWalletId(connector.id);
    }
  });

  useEffectOnce(() => {
    const initialConnector = getInitialConnector(
      getTargetNetworks()[0],
      walletId,
      connectState.connectors,
    );

    if (initialConnector?.connector) {
      connectState.connect({ connector: initialConnector.connector, chainId: initialConnector.chainId });
    }
  });
};
