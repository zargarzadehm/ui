import * as wasm from '@emurgo/cardano-serialization-lib-browser';
import { generateLockAuxiliaryData } from './utils';
import { generateTxBody } from './generateTx';
import { ConnectorContextApi } from '../../bridges';
import { Buffer } from 'buffer';

export const transferOnCardano = async (
  wallet: ConnectorContextApi,
  lockAddress: string,
  toChain: string,
  toAddress: string,
  policyIdHex: string,
  assetNameHex: string,
  amount: bigint,
  bridgeFee: bigint,
  networkFee: bigint
): Promise<string> => {
  // TODO: wallet changeAddress is returning hex string of address, not bech32
  const changeAddress = wasm.Address.from_hex(
    await wallet.getChangeAddress()
  ).to_bech32();

  const auxiliaryData = generateLockAuxiliaryData(
    toChain,
    toAddress,
    changeAddress,
    networkFee.toString(),
    bridgeFee.toString()
  );

  const txBody = await generateTxBody(
    wallet,
    lockAddress,
    changeAddress,
    policyIdHex,
    assetNameHex,
    amount,
    auxiliaryData
  );

  const witnessSet = wasm.TransactionWitnessSet.new();
  const tx = wasm.Transaction.new(txBody, witnessSet, auxiliaryData);
  const vKeys = wasm.TransactionWitnessSet.from_bytes(
    Buffer.from(await wallet.signTx(tx.to_hex(), false), 'hex')
  ).vkeys();
  if (vKeys) witnessSet.set_vkeys(vKeys);

  const signedTx = wasm.Transaction.new(
    txBody,
    witnessSet,
    tx.auxiliary_data()
  );

  return await wallet.submitTx(signedTx.to_hex());
};
