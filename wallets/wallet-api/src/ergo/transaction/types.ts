import { ErgoBoxProxy } from '../../types';

export interface TokenInfo {
  id: string;
  value: bigint;
}

export interface AssetBalance {
  nativeToken: bigint;
  tokens: Array<TokenInfo>;
}

export interface BoxInfo {
  id: string;
  assets: AssetBalance;
}

export interface CoveringBoxes {
  covered: boolean;
  boxes: Array<ErgoBoxProxy>;
}
