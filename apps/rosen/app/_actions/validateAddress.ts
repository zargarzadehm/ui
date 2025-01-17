'use server';

import { Address } from 'ergo-lib-wasm-nodejs';
import { Networks } from '@rosen-ui/constants';

import * as wasm from '@emurgo/cardano-serialization-lib-nodejs';
import { AvailableNetworks } from '@/_networks';
import { isValidAddress } from '@rosen-network/bitcoin';

/**
 * server action to verify the wallet addresses
 * @param walletAddress - wallet address to verify
 * @returns the validation results for the passed address
 */
export const validateAddress = async (
  chain: AvailableNetworks,
  walletAddress: string,
) => {
  try {
    if (chain === Networks.ERGO) {
      Address.from_base58(walletAddress);
    } else if (chain === Networks.CARDANO) {
      wasm.Address.from_bech32(walletAddress);
    } else if (chain == Networks.BITCOIN) {
      if (!isValidAddress(walletAddress)) {
        throw new Error();
      }
    }
    return true;
  } catch {
    return false;
  }
};
