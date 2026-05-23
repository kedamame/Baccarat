import { concatHex, encodeFunctionData, type Hex } from 'viem';
import { Attribution } from 'ox/erc8021';
import { SCORE_ABI, SCORE_CONTRACT_ADDRESS } from './contract';

// Set NEXT_PUBLIC_BUILDER_CODE in .env.local with your bc_xxxxxxxx from Base Build dashboard
const BUILDER_CODE = process.env.NEXT_PUBLIC_BUILDER_CODE;

const BUILDER_SUFFIX: Hex = BUILDER_CODE
  ? (Attribution.toDataSuffix({ codes: [BUILDER_CODE] }) as Hex)
  : '0x';

export function encodeRecordScore(
  finalChips: bigint,
  handsPlayed: bigint,
  wins: bigint,
): { to: Hex; data: Hex } {
  const calldata = encodeFunctionData({
    abi: SCORE_ABI,
    functionName: 'recordScore',
    args: [finalChips, handsPlayed, wins],
  });
  return {
    to: SCORE_CONTRACT_ADDRESS,
    data: BUILDER_CODE ? concatHex([calldata, BUILDER_SUFFIX]) : calldata,
  };
}
