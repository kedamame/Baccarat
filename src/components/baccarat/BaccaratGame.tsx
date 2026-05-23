'use client';

import { useReducer, useCallback, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { useFarcasterMiniApp } from '@/lib/farcaster';
import { gameReducer, createInitialState, handTotal, type BetType } from '@/lib/baccarat';
import { encodeRecordScore } from '@/lib/attribution';
import { isContractConfigured } from '@/lib/contract';
import { Card } from './Card';

const BET_CHIPS = [10, 25, 50, 100, 200, 500];

function formatChips(n: number): string {
  return n.toLocaleString();
}

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

export function BaccaratGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const { isInMiniApp, user } = useFarcasterMiniApp();
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransaction, data: txHash, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const isOnBase = chain?.id === base.id;

  const handleDeal = useCallback(() => {
    dispatch({ type: 'DEAL' });
  }, []);

  const handleBet = useCallback((betType: BetType) => {
    dispatch({ type: 'SET_BET_TYPE', betType });
  }, []);

  const handleAddChip = useCallback((amount: number) => {
    dispatch({ type: 'SET_BET_AMOUNT', amount: state.betAmount + amount });
  }, [state.betAmount]);

  const handleSetBet = useCallback((amount: number) => {
    dispatch({ type: 'SET_BET_AMOUNT', amount });
  }, []);

  const sendScore = useCallback(async (chips: number, handsPlayed: number, wins: number) => {
    if (!isConnected || !isContractConfigured) return;
    if (!isOnBase) {
      try {
        const switched = await switchChainAsync({ chainId: base.id });
        if (switched.id !== base.id) return;
      } catch {
        return;
      }
    }
    const tx = encodeRecordScore(BigInt(chips), BigInt(handsPlayed), BigInt(wins));
    sendTransaction(tx);
  }, [isConnected, isOnBase, switchChainAsync, sendTransaction]);

  const handleRecordScore = useCallback(() => {
    sendScore(state.chips, state.handsPlayed, state.wins);
  }, [sendScore, state.chips, state.handsPlayed, state.wins]);

  const handleCashOut = useCallback(() => {
    const { chips, handsPlayed, wins } = state;
    dispatch({ type: 'CASHOUT' });
    sendScore(chips, handsPlayed, wins);
  }, [state, sendScore]);

  const connectorName = (id: string) => {
    if (id === 'injected') return isInMiniApp ? 'Farcaster Wallet' : 'Browser Wallet';
    if (id === 'coinbaseWalletSDK') return 'Coinbase Wallet';
    if (id === 'walletConnect') return 'WalletConnect';
    return id;
  };

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 430,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '16px 20px 12px',
          borderBottom: '1px solid #33333344',
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1 }}>
            BACCARAT
          </div>
          <div style={{ fontSize: 11, color: 'var(--mid)', marginTop: 2, letterSpacing: 1 }}>
            バカラ
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--mid)', letterSpacing: 0.5 }}>
          <div>BASE MAINNET</div>
          <div><Clock /></div>
          {user && <div style={{ marginTop: 2 }}>{user.displayName ?? user.username}</div>}
        </div>
      </header>

      {/* Wallet bar */}
      <div
        style={{
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 10,
          borderBottom: '1px solid #33333322',
        }}
      >
        {isConnected ? (
          <>
            <span style={{ color: 'var(--mid)' }}>{shortAddr}</span>
            <button
              onClick={() => disconnect()}
              style={{ background: 'none', border: 'none', color: 'var(--mid)', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}
            >
              DISCONNECT
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {connectors.map((c) => (
              <button
                key={c.id}
                onClick={() => connect({ connector: c })}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  fontSize: 10,
                  fontFamily: 'inherit',
                  padding: '3px 8px',
                  letterSpacing: 0.5,
                }}
              >
                {connectorName(c.id)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Game area */}
      <div style={{ flex: 1, padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {state.phase === 'gameover' ? (
          <GameOverPanel
            state={state}
            isConnected={isConnected}
            isSending={isSending}
            isConfirming={isConfirming}
            txSuccess={txSuccess}
            txHash={txHash}
            isOnBase={isOnBase}
            onRecord={handleRecordScore}
            onReset={() => dispatch({ type: 'RESET' })}
          />
        ) : (
          <>
            {/* Banker hand */}
            <HandSection
              label="BANKER"
              labelJa="バンカー"
              cards={state.bankerHand}
              total={state.phase === 'playing' ? state.bankerTotal : null}
              isResult={state.phase === 'playing'}
              highlight={state.result === 'banker'}
            />

            {/* Player hand */}
            <HandSection
              label="PLAYER"
              labelJa="プレイヤー"
              cards={state.playerHand}
              total={state.phase === 'playing' ? state.playerTotal : null}
              isResult={state.phase === 'playing'}
              highlight={state.result === 'player'}
            />

            {/* Result display */}
            {state.phase === 'playing' && state.result && (
              <ResultDisplay result={state.result} payout={state.lastPayout} />
            )}
          </>
        )}
      </div>

      {/* Bottom control panel */}
      {state.phase !== 'gameover' && (
        <ControlPanel
          state={state}
          onBet={handleBet}
          onAddChip={handleAddChip}
          onSetBet={handleSetBet}
          onDeal={handleDeal}
          onNext={() => dispatch({ type: 'NEXT_HAND' })}
          onCashOut={handleCashOut}
          betChips={BET_CHIPS}
          isSendingTx={isSending || isConfirming}
        />
      )}
    </div>
  );
}

function HandSection({
  label,
  labelJa,
  cards,
  total,
  isResult,
  highlight,
}: {
  label: string;
  labelJa: string;
  cards: import('@/lib/baccarat').Card[];
  total: number | null;
  isResult: boolean;
  highlight: boolean;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            color: highlight ? 'var(--fg)' : 'var(--mid)',
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 10, color: 'var(--mid)' }}>{labelJa}</span>
        {total !== null && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 28,
              fontWeight: 900,
              color: highlight ? 'var(--fg)' : 'var(--mid)',
              lineHeight: 1,
            }}
          >
            {total}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, minHeight: 84 }}>
        {cards.length === 0 ? (
          <EmptyCardSlot />
        ) : (
          cards.map((c, i) => <Card key={i} card={c} index={i} />)
        )}
      </div>
    </div>
  );
}

function EmptyCardSlot() {
  return (
    <>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            width: 56,
            height: 84,
            border: '2px dashed #33333333',
            flexShrink: 0,
          }}
        />
      ))}
    </>
  );
}

function ResultDisplay({ result, payout }: { result: 'player' | 'banker' | 'tie'; payout: number }) {
  const labels: Record<string, { en: string; ja: string }> = {
    player: { en: 'PLAYER WINS', ja: 'プレイヤー勝ち' },
    banker: { en: 'BANKER WINS', ja: 'バンカー勝ち' },
    tie: { en: 'TIE', ja: 'タイ' },
  };
  const { en, ja } = labels[result];
  const color = payout > 0 ? '#111111' : payout < 0 ? '#666655' : '#444433';

  return (
    <div className="result-text" style={{ textAlign: 'center', paddingTop: 8 }}>
      <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>{en}</div>
      <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 2 }}>{ja}</div>
      <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6, color }}>
        {payout > 0 ? `+${formatChips(payout)}` : formatChips(payout)}
      </div>
    </div>
  );
}

function ControlPanel({
  state,
  onBet,
  onAddChip,
  onSetBet,
  onDeal,
  onNext,
  onCashOut,
  betChips,
  isSendingTx,
}: {
  state: ReturnType<typeof createInitialState>;
  onBet: (b: BetType) => void;
  onAddChip: (n: number) => void;
  onSetBet: (n: number) => void;
  onDeal: () => void;
  onNext: () => void;
  onCashOut: () => void;
  betChips: number[];
  isSendingTx: boolean;
}) {
  const isBetting = state.phase === 'betting';
  const isPlaying = state.phase === 'playing';

  return (
    <div
      style={{
        borderTop: '2px solid var(--border)',
        padding: '16px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        backgroundColor: 'var(--bg)',
      }}
    >
      {/* Chips and bet display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: 9, color: 'var(--mid)', letterSpacing: 1 }}>CHIPS / チップ</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{formatChips(state.chips)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: 'var(--mid)', letterSpacing: 1 }}>BET / 賭け</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: state.betType ? 'var(--fg)' : 'var(--mid)' }}>
            {formatChips(state.betAmount)}
          </div>
        </div>
      </div>

      {isBetting && (
        <>
          {/* Chip buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {betChips.map((chip) => (
              <button
                key={chip}
                onClick={() => onAddChip(chip)}
                disabled={state.betAmount + chip > state.chips}
                style={{
                  flex: 1,
                  minWidth: 44,
                  padding: '6px 0',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: state.betAmount + chip > state.chips ? 'var(--mid)' : 'var(--fg)',
                }}
              >
                +{chip}
              </button>
            ))}
          </div>

          {/* Clear / All In */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => onSetBet(10)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: 10,
                color: 'var(--mid)',
                cursor: 'pointer',
                letterSpacing: 0.5,
                padding: 0,
              }}
            >
              RESET BET / クリア
            </button>
            <button
              onClick={() => onSetBet(state.chips)}
              disabled={state.chips <= (state.betAmount)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                fontFamily: 'inherit',
                fontSize: 10,
                fontWeight: 700,
                color: state.chips > state.betAmount ? 'var(--fg)' : 'var(--mid)',
                cursor: state.chips > state.betAmount ? 'pointer' : 'default',
                letterSpacing: 1,
                padding: '4px 10px',
              }}
            >
              ALL IN / 全額
            </button>
          </div>

          {/* Bet type buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['player', 'banker', 'tie'] as BetType[]).map((bt) => {
              const labels: Record<BetType, { en: string; ja: string; odds: string }> = {
                player: { en: 'PLAYER', ja: 'プレイヤー', odds: '1:1' },
                banker: { en: 'BANKER', ja: 'バンカー', odds: '0.95:1' },
                tie: { en: 'TIE', ja: 'タイ', odds: '8:1' },
              };
              const { en, ja, odds } = labels[bt];
              const selected = state.betType === bt;
              return (
                <button
                  key={bt}
                  onClick={() => onBet(bt)}
                  style={{
                    flex: 1,
                    padding: '10px 4px',
                    border: `2px solid ${selected ? 'var(--fg)' : '#33333344'}`,
                    backgroundColor: selected ? 'var(--fg)' : 'transparent',
                    color: selected ? 'var(--bg)' : 'var(--fg)',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{en}</div>
                  <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{ja}</div>
                  <div style={{ fontSize: 9, marginTop: 3, opacity: 0.6 }}>{odds}</div>
                </button>
              );
            })}
          </div>

          {/* Deal button */}
          <button
            onClick={onDeal}
            disabled={!state.betType || state.betAmount <= 0}
            style={{
              padding: '14px',
              backgroundColor: (state.betType && state.betAmount > 0) ? 'var(--fg)' : '#33333333',
              color: (state.betType && state.betAmount > 0) ? 'var(--bg)' : 'var(--mid)',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 3,
              cursor: (state.betType && state.betAmount > 0) ? 'pointer' : 'default',
            }}
          >
            DEAL / 配る
          </button>
        </>
      )}

      {isPlaying && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onNext}
            style={{
              flex: 2,
              padding: '14px',
              backgroundColor: 'var(--fg)',
              color: 'var(--bg)',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 2,
              cursor: 'pointer',
            }}
          >
            NEXT HAND / 次へ
          </button>
          <button
            onClick={onCashOut}
            disabled={isSendingTx}
            style={{
              flex: 1,
              padding: '14px',
              backgroundColor: 'transparent',
              color: isSendingTx ? '#99998877' : 'var(--mid)',
              border: '1px solid #33333355',
              fontFamily: 'inherit',
              fontSize: 11,
              fontWeight: 700,
              cursor: isSendingTx ? 'default' : 'pointer',
            }}
          >
            {isSendingTx ? '送信中...' : 'CASH OUT'}
          </button>
        </div>
      )}
    </div>
  );
}

function GameOverPanel({
  state,
  isConnected,
  isSending,
  isConfirming,
  txSuccess,
  txHash,
  isOnBase,
  onRecord,
  onReset,
}: {
  state: ReturnType<typeof createInitialState>;
  isConnected: boolean;
  isSending: boolean;
  isConfirming: boolean;
  txSuccess: boolean;
  txHash?: `0x${string}`;
  isOnBase: boolean;
  onRecord: () => void;
  onReset: () => void;
}) {
  const winRate = state.handsPlayed > 0
    ? Math.round((state.wins / state.handsPlayed) * 100)
    : 0;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 12 }}>
      <div>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>
          {state.chips === 0 ? 'GAME OVER' : 'CASHED OUT'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--mid)', marginTop: 4 }}>
          {state.chips === 0 ? 'ゲームオーバー' : 'キャッシュアウト'}
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderTop: '1px solid #33333333', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'FINAL CHIPS', labelJa: '最終チップ', value: formatChips(state.chips) },
          { label: 'HANDS PLAYED', labelJa: 'プレイ数', value: String(state.handsPlayed) },
          { label: 'WINS', labelJa: '勝利数', value: `${state.wins} (${winRate}%)` },
          { label: 'PEAK CHIPS', labelJa: '最高チップ', value: formatChips(state.peakChips) },
        ].map(({ label, labelJa, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: 10, letterSpacing: 1, color: 'var(--mid)' }}>{label}</span>
              <span style={{ fontSize: 9, color: 'var(--mid)', marginLeft: 6 }}>{labelJa}</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Record on-chain */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!isConnected && (
          <div style={{ fontSize: 10, color: 'var(--mid)', textAlign: 'center' }}>
            Connect wallet to record score on Base
          </div>
        )}
        {isConnected && !isContractConfigured && (
          <div style={{ fontSize: 10, color: 'var(--mid)', textAlign: 'center' }}>
            Deploy BaccaratLeaderboard.sol and set NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS
          </div>
        )}

        {txSuccess && txHash ? (
          <div style={{ fontSize: 10, color: '#447744', textAlign: 'center', letterSpacing: 0.5 }}>
            RECORDED ON BASE<br />
            <span style={{ opacity: 0.7 }}>{txHash.slice(0, 18)}...</span>
          </div>
        ) : (
          <button
            onClick={onRecord}
            disabled={!isConnected || !isContractConfigured || isSending || isConfirming}
            style={{
              padding: '14px',
              backgroundColor: isConnected && isContractConfigured && !isSending && !isConfirming ? 'var(--fg)' : '#33333333',
              color: isConnected && isContractConfigured && !isSending && !isConfirming ? 'var(--bg)' : 'var(--mid)',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 2,
              cursor: isConnected && isContractConfigured && !isSending && !isConfirming ? 'pointer' : 'default',
            }}
          >
            {isSending ? 'CONFIRM IN WALLET...' : isConfirming ? 'CONFIRMING...' : !isOnBase ? 'SWITCH TO BASE & RECORD' : 'RECORD ON BASE / 記録する'}
          </button>
        )}

        <button
          onClick={onReset}
          style={{
            padding: '12px',
            backgroundColor: 'transparent',
            color: 'var(--fg)',
            border: '1px solid #33333355',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: 'pointer',
          }}
        >
          PLAY AGAIN / もう一度
        </button>
      </div>
    </div>
  );
}
