import { UnsignedErgoTxProxy } from '../../bridges';
import { ErgoBoxProxy } from '../../types';
import * as wasm from 'ergo-lib-wasm-browser';

export const unsignedTransactionToProxy = (
  unsignedTx: wasm.UnsignedTransaction,
  inputs: ErgoBoxProxy[]
): UnsignedErgoTxProxy => {
  const unsignedErgoTxProxy = unsignedTx.to_js_eip12();
  unsignedErgoTxProxy.inputs = inputs.map((box) => {
    return {
      ...box,
      extension: {},
    };
  });
  return unsignedErgoTxProxy;
};
