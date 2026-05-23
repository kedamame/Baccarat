import type { Hex } from 'viem';

export const SCORE_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
) as Hex;

export const isContractConfigured =
  !!process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS &&
  process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

export const SCORE_ABI = [
  {
    name: 'recordScore',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'finalChips', type: 'uint256' },
      { name: 'handsPlayed', type: 'uint256' },
      { name: 'wins', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'scores',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [
      { name: 'finalChips', type: 'uint256' },
      { name: 'handsPlayed', type: 'uint256' },
      { name: 'wins', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
] as const;
