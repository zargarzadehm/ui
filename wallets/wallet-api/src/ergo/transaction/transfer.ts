import { ErgoBridge } from '../../bridges';
import { generateUnsignedTx } from './generateTx';

export const transferOnErgo = async (
  wallet: ErgoBridge,
  lockAddress: string,
  toChain: string,
  toAddress: string,
  tokenId: string,
  amount: bigint,
  bridgeFee: bigint,
  networkFee: bigint
): Promise<string> => {
  const unsignedTx = await generateUnsignedTx(
    wallet,
    lockAddress,
    toChain,
    toAddress,
    tokenId,
    amount,
    bridgeFee,
    networkFee
  );
  const signedTx = await wallet.sign_tx(unsignedTx);
  return await wallet.submit_tx(signedTx);
};
