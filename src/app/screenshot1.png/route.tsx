import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Suits as ASCII to avoid Satori Google Fonts 400 errors on Unicode symbols
const CARDS_BANKER = [
  { rank: 'K', suit: 'S' },
  { rank: '6', suit: 'H' },
];
const CARDS_PLAYER = [
  { rank: 'A', suit: 'C' },
  { rank: '6', suit: 'D' },
];

function CardBlock({ rank, suit }: { rank: string; suit: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 110,
        height: 165,
        border: '4px solid #111111',
        backgroundColor: '#f5f2ea',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 26, fontWeight: 700, color: '#111111', lineHeight: 1 }}>
        <span style={{ display: 'flex' }}>{rank}</span>
        <span style={{ display: 'flex' }}>{suit}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 26, fontWeight: 700, color: '#111111', lineHeight: 1, alignItems: 'flex-end', transform: 'rotate(180deg)' }}>
        <span style={{ display: 'flex' }}>{rank}</span>
        <span style={{ display: 'flex' }}>{suit}</span>
      </div>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ece8de',
          fontFamily: 'monospace',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 32, paddingLeft: 48, paddingRight: 48, borderBottom: '2px solid #33333333' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#111111', letterSpacing: -1 }}>BACCARAT</div>
            <div style={{ display: 'flex', fontSize: 20, color: '#888880' }}>BACCARAT</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', fontSize: 16, color: '#888880' }}>BASE MAINNET</div>
            <div style={{ display: 'flex', fontSize: 16, color: '#888880' }}>04:03</div>
          </div>
        </div>

        {/* Game area */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 48, paddingLeft: 48, paddingRight: 48, gap: 40, flex: 1 }}>
          {/* Banker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: '#888880', letterSpacing: 4 }}>BANKER</span>
              </div>
              <span style={{ display: 'flex', fontSize: 56, fontWeight: 900, color: '#888880' }}>6</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {CARDS_BANKER.map((c, i) => <CardBlock key={i} rank={c.rank} suit={c.suit} />)}
            </div>
          </div>

          {/* Player */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: '#111111', letterSpacing: 4 }}>PLAYER</span>
              </div>
              <span style={{ display: 'flex', fontSize: 56, fontWeight: 900, color: '#111111' }}>7</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {CARDS_PLAYER.map((c, i) => <CardBlock key={i} rank={c.rank} suit={c.suit} />)}
            </div>
          </div>

          {/* Result */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#111111', letterSpacing: 2 }}>PLAYER WINS</div>
            <div style={{ display: 'flex', fontSize: 56, fontWeight: 900, color: '#111111', marginTop: 12 }}>+50</div>
          </div>
        </div>

        {/* Bottom panel */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 32, paddingBottom: 48, paddingLeft: 48, paddingRight: 48, borderTop: '4px solid #111111', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'flex', fontSize: 16, color: '#888880', letterSpacing: 2 }}>CHIPS</span>
              <span style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#111111' }}>1,050</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ display: 'flex', fontSize: 16, color: '#888880', letterSpacing: 2 }}>BET</span>
              <span style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#111111' }}>50</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flex: 2, padding: 28, backgroundColor: '#111111', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ display: 'flex', fontSize: 24, fontWeight: 900, color: '#ece8de', letterSpacing: 3 }}>NEXT HAND</span>
            </div>
            <div style={{ display: 'flex', flex: 1, padding: 28, border: '2px solid #33333355', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ display: 'flex', fontSize: 18, fontWeight: 700, color: '#888880', letterSpacing: 2 }}>CASH OUT</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 },
  );
}
