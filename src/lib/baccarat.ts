export type Suit = 'S' | 'H' | 'D' | 'C';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type BetType = 'player' | 'banker' | 'tie';
export type GameResult = 'player' | 'banker' | 'tie';
export type Phase = 'betting' | 'playing' | 'gameover';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface GameState {
  phase: Phase;
  playerHand: Card[];
  bankerHand: Card[];
  deck: Card[];
  chips: number;
  betAmount: number;
  betType: BetType | null;
  result: GameResult | null;
  playerTotal: number;
  bankerTotal: number;
  handsPlayed: number;
  wins: number;
  peakChips: number;
  lastPayout: number;
}

const SUITS: Suit[] = ['S', 'H', 'D', 'C'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function cardValue(rank: Rank): number {
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 0;
  if (rank === 'A') return 1;
  return parseInt(rank, 10);
}

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (let d = 0; d < 8; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ suit, rank, value: cardValue(rank) });
      }
    }
  }
  return shuffle(deck);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function handTotal(cards: Card[]): number {
  return cards.reduce((sum, c) => sum + c.value, 0) % 10;
}

function bankerDrawsWithPlayerThird(bankerTotal: number, playerThirdValue: number): boolean {
  if (bankerTotal <= 2) return true;
  if (bankerTotal === 3) return playerThirdValue !== 8;
  if (bankerTotal === 4) return [2, 3, 4, 5, 6, 7].includes(playerThirdValue);
  if (bankerTotal === 5) return [4, 5, 6, 7].includes(playerThirdValue);
  if (bankerTotal === 6) return [6, 7].includes(playerThirdValue);
  return false;
}

function deal(deck: Card[]): { playerHand: Card[]; bankerHand: Card[]; deck: Card[] } {
  const d = [...deck];
  const playerHand: Card[] = [d.pop()!, d.pop()!];
  const bankerHand: Card[] = [d.pop()!, d.pop()!];

  const pTotal = handTotal(playerHand);
  const bTotal = handTotal(bankerHand);

  if (pTotal >= 8 || bTotal >= 8) return { playerHand, bankerHand, deck: d };

  let playerThird: Card | null = null;
  if (pTotal <= 5) {
    playerThird = d.pop()!;
    playerHand.push(playerThird);
  }

  const newBTotal = handTotal(bankerHand);
  const bankerDraws = playerThird === null
    ? newBTotal <= 5
    : bankerDrawsWithPlayerThird(newBTotal, playerThird.value);

  if (bankerDraws) bankerHand.push(d.pop()!);

  return { playerHand, bankerHand, deck: d };
}

function getResult(p: number, b: number): GameResult {
  if (p > b) return 'player';
  if (b > p) return 'banker';
  return 'tie';
}

function payout(betType: BetType, result: GameResult, betAmount: number): number {
  // Standard baccarat: Player/Banker bets push (return 0) on tie
  if (result === 'tie' && betType !== 'tie') return 0;
  if (betType !== result) return -betAmount;
  if (result === 'player') return betAmount;
  if (result === 'banker') return Math.floor(betAmount * 0.95);
  return betAmount * 8;
}

export function createInitialState(): GameState {
  return {
    phase: 'betting',
    playerHand: [],
    bankerHand: [],
    deck: createDeck(),
    chips: 1000,
    betAmount: 50,
    betType: null,
    result: null,
    playerTotal: 0,
    bankerTotal: 0,
    handsPlayed: 0,
    wins: 0,
    peakChips: 1000,
    lastPayout: 0,
  };
}

export type GameAction =
  | { type: 'SET_BET_TYPE'; betType: BetType }
  | { type: 'SET_BET_AMOUNT'; amount: number }
  | { type: 'DEAL' }
  | { type: 'NEXT_HAND' }
  | { type: 'CASHOUT' }
  | { type: 'RESET' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_BET_TYPE':
      if (state.phase !== 'betting') return state;
      return { ...state, betType: action.betType };

    case 'SET_BET_AMOUNT': {
      if (state.phase !== 'betting') return state;
      const amount = Math.max(10, Math.min(action.amount, state.chips));
      return { ...state, betAmount: amount };
    }

    case 'DEAL': {
      if (state.phase !== 'betting' || !state.betType || state.betAmount <= 0) return state;
      const deck = state.deck.length < 16 ? createDeck() : state.deck;
      const { playerHand, bankerHand, deck: newDeck } = deal(deck);
      const pTotal = handTotal(playerHand);
      const bTotal = handTotal(bankerHand);
      const result = getResult(pTotal, bTotal);
      const p = payout(state.betType, result, state.betAmount);
      const newChips = state.chips + p;
      const isWin = p > 0;
      return {
        ...state,
        phase: newChips <= 0 ? 'gameover' : 'playing',
        playerHand,
        bankerHand,
        deck: newDeck,
        chips: Math.max(0, newChips),
        result,
        playerTotal: pTotal,
        bankerTotal: bTotal,
        handsPlayed: state.handsPlayed + 1,
        wins: isWin ? state.wins + 1 : state.wins,
        peakChips: Math.max(state.peakChips, Math.max(0, newChips)),
        lastPayout: p,
      };
    }

    case 'NEXT_HAND':
      return {
        ...state,
        phase: 'betting',
        playerHand: [],
        bankerHand: [],
        result: null,
        betType: null,
        betAmount: Math.min(state.betAmount, state.chips),
        lastPayout: 0,
      };

    case 'CASHOUT':
      return { ...state, phase: 'gameover' };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}
