import JsonBigInt from '@rosen-bridge/json-bigint';
import { RosenChainToken, TokenMap } from '@rosen-bridge/tokens';

import { getDecimalString } from '@rosen-ui/utils';

import { feeAndMinBoxValue as cardanoFeeAndMinBoxValue } from '@/_networks/cardano/transaction/consts';

import { calculateFee } from '@/_actions/calculateFee';

import { Networks } from '@/_constants';
import {
  fee as ergoFee,
  minBoxValue as ergoMinBoxValue,
} from '@/_networks/ergo/transaction/consts';
import { encode } from 'cbor-x';

/**
 * a utility to make unique interface for accessing token name
 */
export const getTokenNameAndId = (
  token: RosenChainToken,
  network: keyof typeof Networks,
) => {
  if ([Networks.ergo, Networks.cardano, Networks.bitcoin].includes(network)) {
    return {
      tokenName: token.name,
      tokenId: token.tokenId,
    };
  }
};

const chainMaxTransferOffset = {
  ergo: ergoFee + ergoMinBoxValue,
  cardano: cardanoFeeAndMinBoxValue,
  bitcoin: 0,
};
/**
 * get max transferable amount of a token
 * @param balance
 * @param chain
 * @param isNative
 */
export const getMaxTransferableAmount = (
  balance: number,
  chain: 'ergo' | 'cardano' | 'bitcoin',
  isNative: boolean,
) => {
  const offsetCandidate = Number(chainMaxTransferOffset[chain]);
  const shouldApplyOffset = isNative;
  const offset = shouldApplyOffset ? offsetCandidate : 0;
  return balance - offset;
};

/**
 * get max transferable amount of a token
 * @param token
 * @param amount
 * @param sourceChain
 */
export const getMinTransferAmount = async (
  token: RosenChainToken,
  sourceChain: keyof typeof Networks,
  targetChain: keyof typeof Networks,
  tokensMap: any,
) => {
  const tokenMap = new TokenMap(tokensMap);
  const idKey = tokenMap.getIdKey(sourceChain);
  const tokens = tokenMap.search(sourceChain, {
    [idKey]: token[idKey],
  });
  const ergoTokenId = tokens[0].ergo.tokenId;

  const data = await calculateFee(sourceChain, targetChain, ergoTokenId, 0);
  const parsedData = {
    ...data,
    data: JsonBigInt.parse(data.data!),
  };
  const { fees } = parsedData.data;

  const networkFee = fees ? Number(fees.networkFee) : 0;
  const bridgeFee = fees ? Number(fees.bridgeFee) : 0;

  const minTransferAmountValue = bridgeFee + networkFee;

  return minTransferAmountValue
    ? getDecimalString(
        (minTransferAmountValue + 1).toString() || '0',
        token?.decimals || 0,
      )
    : '0';
};

/**
 * convert a hex to cbor
 * @param hex
 */
export const hexToCbor = (hex: string) =>
  Buffer.from(encode(Buffer.from(hex, 'hex'))).toString('hex');

/**
 * remove the decimal points from the input number and
 * convert number to bigInt
 * @param inputNumber
 */

export const convertNumberToBigint = (inputNumber: number) =>
  BigInt(Math.trunc(inputNumber));
