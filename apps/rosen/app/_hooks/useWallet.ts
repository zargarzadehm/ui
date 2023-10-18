import { useEffect, useContext, useCallback, useRef } from 'react';
import {
  ConnectorContextApi,
  ErgoBridge,
  Wallet,
  transferOnCardano,
  transferOnErgo,
} from '@rosen-ui/wallet-api';
import { useLocalStorageManager } from '@rosen-ui/utils';

import useNetwork from './useNetwork';

import { WalletContext } from '@/_contexts/walletContext';
import Nami from '@rosen-ui/nami-wallet';

interface ConnectorAPI {
  enable(): Promise<ConnectorContextApi>;
  isEnabled(): Promise<boolean>;
  experimental?: unknown;
}
declare global {
  let cardano: { [key: string]: ConnectorAPI };
}

declare global {
  let ergoConnector: {
    nautilus: {
      connect: (params: { createErgoObject: boolean }) => Promise<boolean>;
      getContext: () => Promise<ErgoBridge>;
    };
  };

  let ergo: ErgoBridge;
}

interface WalletDescriptor {
  readonly name: string;
  readonly expDate: string;
}

const toWalletDescriptor = (wallet: Wallet): WalletDescriptor => {
  let expDate = new Date();
  return {
    name: wallet.name,
    expDate: expDate.setDate(expDate.getDate() + 2).toString(),
  };
};
/**
 * handles the wallet connections for all the networks
 * and reconnect to the wallet on app startup
 */
const useWallet = () => {
  const walletGlobalContext = useContext(WalletContext);
  const isConnecting = useRef<boolean>(false);
  const { get, set } = useLocalStorageManager();

  const { selectedNetwork } = useNetwork();

  const getWallet = useCallback(
    (name: string): Wallet => {
      let wallet: Wallet | undefined;
      wallet = selectedNetwork?.availableWallets.find((w) => w.name === name);

      if (!wallet) {
        throw new Error(`unsupported wallet with name ${name}`);
      }

      return wallet;
    },
    [selectedNetwork],
  );

  const getCurrentWallet = useCallback((): Wallet | undefined => {
    const currentWalletDescriptor =
      selectedNetwork && get<WalletDescriptor>(selectedNetwork?.name);

    if (!currentWalletDescriptor) {
      return undefined;
    }

    return currentWalletDescriptor
      ? getWallet(currentWalletDescriptor.name)
      : undefined;
  }, [selectedNetwork, getWallet, get]);

  const setSelectedWallet = useCallback(
    async (wallet: Wallet) => {
      const prevWallet = getCurrentWallet();
      const status = await wallet.connectWallet();

      if (typeof status === 'boolean' && status) {
        prevWallet?.onDisconnect && prevWallet.onDisconnect();
        wallet.onConnect && wallet.onConnect();
        set<WalletDescriptor>(
          selectedNetwork!.name,
          toWalletDescriptor(wallet),
        );
        walletGlobalContext?.dispatch({ type: 'set', wallet });
      }
    },
    [selectedNetwork, getCurrentWallet, walletGlobalContext, set],
  );

  const handleConnection = useCallback(async () => {
    const selectedWallet = getCurrentWallet();
    if (
      selectedWallet?.name !== walletGlobalContext?.state.selectedWallet?.name
    ) {
      if (selectedWallet) {
        const status = await selectedWallet.connectWallet();
        if (typeof status === 'boolean' && status) {
          walletGlobalContext?.dispatch({
            type: 'set',
            wallet: selectedWallet,
          });
        }
        isConnecting.current = false;
      } else {
        walletGlobalContext?.dispatch({ type: 'remove' });
      }
    }
  }, [walletGlobalContext, getCurrentWallet]);

  useEffect(() => {
    if (typeof window === 'object') {
      handleConnection();
    }
  }, [handleConnection]);

  return selectedNetwork
    ? {
        setSelectedWallet,
        selectedWallet: walletGlobalContext?.state.selectedWallet,
        availableWallets: selectedNetwork.availableWallets,
        getBalance: walletGlobalContext?.state.selectedWallet?.getBalance,
        transfer: async (data: any) => {
          // const wallet = await cardano.nami.enable()
          // transferOnCardano(
          //   wallet,
          //   'addr1v9kmp9flrq8gzh287q4kku8vmad3vkrw0rwqvjas6vyrf9s9at4dn',
          //   'ergo',
          //   '9gcrKn7L5Ln3rRsjFoSEkEsovUdb5JR5d6o2vHQV5FCXXNkkEAD',
          //   'e0c24b2010068e55bc8f860978d52ee8e62d9af06f106f1fa0d0fd0b',
          //   '727074574e4556310a',
          //   555426n,
          //   248000n,
          //   248n
          // )
          const wallet = await ergoConnector.nautilus.getContext();
          transferOnErgo(
            wallet,
            'nB3L2PD3JzpCPns7SoypaDJTg4KbG6UQBPknQuM3WZ4ZhPj3TGV5R5YArit7trzUum77qJ76JLLiJfW3Au8o3AvMh1suY2rcRm1UPfroUiTZfQrNL8izs6CBJYwMLf5jDSt3YwcFEPVYG',
            'cardano',
            'addr1q9nwglllt7j00yf40wveac2tgtmxxy7y06nturs6l83wn9g37djlnz5hmmmkxenxl8mwql6h96gu7ztphgxjf0ngwhfqwadm7d',
            'erg',
            5577148568n,
            2000000000n,
            800000000n,
          );
        },
      }
    : {};
};

export default useWallet;
