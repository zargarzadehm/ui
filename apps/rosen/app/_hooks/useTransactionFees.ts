import { useState, useLayoutEffect, useMemo } from 'react';
import useSWR from 'swr';
import type { BridgeMinimumFee } from '@rosen-bridge/minimum-fee-browser';
import { RosenChainToken } from '@rosen-bridge/tokens';

import useChainHeight from './useChainHeight';

import { getTokenNameAndId } from '@/_utils';

import {
  Chains,
  ergoSourceChain,
  ergoExplorerUrl,
  cardanoSourceChain,
  cardanoExplorerUrl,
  feeRatio,
  nextFeeHeight,
} from '@/_constants';

const bridgeFetcher =
  (BridgeMinimumFee: BridgeMinimumFee | null) =>
  async ([sourceChain, tokenId, height]: [
    string | null,
    string | null,
    number | null,
  ]) => {
    if (!sourceChain || !tokenId || !height || !BridgeMinimumFee) return null;
    const data = await BridgeMinimumFee.getFee(tokenId, sourceChain, height);
    return data;
  };

const useTransactionFees = (
  sourceChain: keyof typeof Chains | null,
  token: RosenChainToken | null,
  amount: number | null,
) => {
  const { height, isLoading: isLoadingHeights } = useChainHeight(sourceChain);
  const [minFeeObject, setMinFeeObject] = useState<{
    [chain: string]: BridgeMinimumFee;
  }>({});

  const {
    data: fees,
    isLoading: isLoadingMinFee,
    error,
  } = useSWR(
    [
      sourceChain,
      token ? getTokenNameAndId(token).tokenId : null,
      Number(height),
    ],
    bridgeFetcher(sourceChain ? minFeeObject?.[sourceChain] : null),
  );

  const { data: Nextfees, isLoading: isLoadingNextFees } = useSWR(
    [
      sourceChain,
      token ? getTokenNameAndId(token).tokenId : null,
      Number(height) + nextFeeHeight,
    ],
    bridgeFetcher(sourceChain ? minFeeObject?.[sourceChain] : null),
  );

  useLayoutEffect(() => {
    const LoadMinFee = async () => {
      if (typeof window === 'object') {
        const BridgeMinimumFee = (
          await import('@rosen-bridge/minimum-fee-browser')
        ).BridgeMinimumFee;

        const cradano = new BridgeMinimumFee(
          cardanoExplorerUrl,
          cardanoSourceChain,
        );
        const ergo = new BridgeMinimumFee(ergoExplorerUrl, ergoSourceChain);

        setMinFeeObject({
          [Chains.ergo]: ergo,
          [Chains.cardano]: cradano,
        });
      }
    };
    LoadMinFee();
  }, []);

  const isLoading =
    isLoadingHeights ||
    isLoadingMinFee ||
    isLoadingNextFees ||
    (sourceChain && !minFeeObject?.[sourceChain]);

  const transactionFees = useMemo(() => {
    let paymentAmount = (amount || 0) * Math.pow(10, token?.decimals || 0);
    const networkFee = fees ? Number(fees.networkFee) : -1;
    const bridgeFee = fees
      ? Math.max(Number(fees.bridgeFee), Math.ceil(paymentAmount * feeRatio))
      : -1;

    return {
      bridgeFee,
      networkFee,
      receivingAmount: fees ? paymentAmount - (networkFee + bridgeFee) : 0,
      minTransferAmount: Math.max(
        bridgeFee + networkFee,
        Math.ceil(networkFee / (1 - feeRatio)),
      ),
      isLoading,
    };
  }, [amount, fees, isLoading, token]);

  return transactionFees;
};

export default useTransactionFees;