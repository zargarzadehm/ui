import { ReactNode } from 'react';
import type { RosenChainToken } from '@rosen-bridge/tokens';
import {
  Address,
  AssetName,
  TxId,
  ErgoBox,
  ErgoTx,
  Prover,
  Wallet,
} from '../types';

/**
 * ergo token info
 */
export interface ErgoToken extends RosenChainToken {
  tokenId: Address;
  tokenName: AssetName;
  decimals: number;
}

/**
 * main interface the connect and control ergo wallets
 */
export interface ErgoWallet extends Wallet, Prover {
  readonly getBalance: (token: RosenChainToken) => Promise<ReactNode>;
  readonly getUsedAddresses?: () => Address[];
  readonly getUnusedAddresses?: () => Address[];
  readonly getChangeAddress?: () => Address;
  readonly getAddresses?: () => Address[];
  readonly getUtxos?: () => ErgoBox[];
  readonly submitTx?: (tx: ErgoTx) => TxId;
  readonly hidden?: boolean;
}

export * from './transaction/transfer';
