import { useState } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { Abi, ExtractAbiFunctionNames } from "abitype";
import { useChainId, useWriteContract } from "wagmi";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { ContractAbi, ContractName, UseScaffoldWriteConfig } from "~~/utils/scaffold-eth/contract";

/**
 * Wrapper around wagmi's useWriteContract hook which automatically loads (by name) the contract ABI and address from
 * the contracts present in deployedContracts.ts & externalContracts.ts corresponding to targetNetworks configured in scaffold.config.ts
 * @param config - The config settings, including extra wagmi configuration
 * @param config.contractName - contract name
 * @param config.functionName - name of the function to be called
 * @param config.args - arguments for the function
 * @param config.value - value in ETH that will be sent with transaction
 * @param config.blockConfirmations - number of block confirmations to wait for (default: 1)
 * @param config.onBlockConfirmation - callback that will be called after blockConfirmations.
 */
export const useScaffoldContractWrite = <
  TContractName extends ContractName,
  TFunctionName extends ExtractAbiFunctionNames<ContractAbi<TContractName>, "nonpayable" | "payable">,
>({
  contractName,
  functionName,
  args,
  value,
  onBlockConfirmation,
  blockConfirmations,
  ...writeConfig
}: UseScaffoldWriteConfig<TContractName, TFunctionName>) => {
  const { data: deployedContractData } = useDeployedContractInfo(contractName);
  const chainId = useChainId();
  const writeTx = useTransactor();
  const [isMining, setIsMining] = useState(false);
  const { targetNetwork } = useTargetNetwork();

  const { writeContract, ...wagmiContractWrite } = useWriteContract();

  const sendContractWriteTx = async ({
    args: newArgs,
    value: newValue,
  }: {
    args?: UseScaffoldWriteConfig<TContractName, TFunctionName>["args"];
    value?: UseScaffoldWriteConfig<TContractName, TFunctionName>["value"];
  } = {}) => {
    if (!deployedContractData) {
      notification.error("Target Contract is not deployed, did you forget to run `yarn deploy`?");
      return;
    }
    if (!chainId) {
      notification.error("Please connect your wallet");
      return;
    }
    if (chainId !== targetNetwork.id) {
      notification.error("You are on the wrong network");
      return;
    }

    if (writeContract) {
      try {
        setIsMining(true);
        const writeTxResult = await writeTx(
          async () =>
            await writeContract({
              address: deployedContractData.address,
              abi: deployedContractData.abi as Abi,
              functionName: functionName as any,
              args: (newArgs ?? args) as unknown[],
              value: newValue ?? value,
            }),
          { onBlockConfirmation, blockConfirmations },
        );

        return writeTxResult;
      } catch (e: any) {
        throw e;
      } finally {
        setIsMining(false);
      }
    } else {
      notification.error("Contract writer error. Try again.");
      return;
    }
  };

  return {
    ...wagmiContractWrite,
    isMining,
    // Overwrite wagmi's write async
    writeAsync: sendContractWriteTx,
  };
};
