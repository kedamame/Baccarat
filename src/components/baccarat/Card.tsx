import type { Card as CardType } from '@/lib/baccarat';

const SUIT_SYMBOL: Record<string, string> = {
  S: '♠',
  H: '♥',
  D: '♦',
  C: '♣',
};

const RED_SUITS = new Set(['H', 'D']);

interface CardProps {
  card: CardType;
  index?: number;
}

export function Card({ card, index = 0 }: CardProps) {
  const symbol = SUIT_SYMBOL[card.suit];
  const isRed = RED_SUITS.has(card.suit);

  return (
    <div
      className="deal-anim"
      style={{
        animationDelay: `${index * 0.12}s`,
        opacity: 0,
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 56,
        height: 84,
        backgroundColor: 'var(--card-bg)',
        border: '2px solid var(--border)',
        padding: '6px 5px',
        fontFamily: 'Courier New, monospace',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1,
          color: isRed ? '#8a0000' : '#111111',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700 }}>{card.rank}</span>
        <span style={{ fontSize: 12 }}>{symbol}</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1,
          alignItems: 'flex-end',
          transform: 'rotate(180deg)',
          color: isRed ? '#8a0000' : '#111111',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700 }}>{card.rank}</span>
        <span style={{ fontSize: 12 }}>{symbol}</span>
      </div>
    </div>
  );
}

export function CardBack({ index = 0 }: { index?: number }) {
  return (
    <div
      className="deal-anim"
      style={{
        animationDelay: `${index * 0.12}s`,
        opacity: 0,
        width: 56,
        height: 84,
        backgroundColor: '#1a1a1a',
        border: '2px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundImage:
          'repeating-linear-gradient(45deg, #222 0px, #222 2px, #111 2px, #111 8px)',
      }}
    />
  );
}
