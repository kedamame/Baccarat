import { ImageResponse } from 'next/og';

export const runtime = 'edge';

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
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 80,
          paddingRight: 80,
          justifyContent: 'space-between',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 18, color: '#888880', letterSpacing: 4, fontFamily: 'monospace' }}>
              BASE MAINNET
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: '#888880', fontFamily: 'monospace' }}>
              BACCARAT
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', fontSize: 16, color: '#888880', fontFamily: 'monospace' }}>
              GAMES
            </div>
          </div>
        </div>

        {/* Center: pixel card mockup — suits as ASCII to avoid Satori font errors */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
          {[
            { rank: 'K', suit: 'S' },
            { rank: 'A', suit: 'S' },
            { rank: '3', suit: 'S' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: 100,
                height: 150,
                border: '4px solid #111111',
                backgroundColor: '#f5f2ea',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 24, fontWeight: 700, color: '#111111', lineHeight: 1, fontFamily: 'monospace' }}>
                <span style={{ display: 'flex' }}>{c.rank}</span>
                <span style={{ display: 'flex' }}>{c.suit}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 24, fontWeight: 700, color: '#111111', lineHeight: 1, fontFamily: 'monospace', alignItems: 'flex-end', transform: 'rotate(180deg)' }}>
                <span style={{ display: 'flex' }}>{c.rank}</span>
                <span style={{ display: 'flex' }}>{c.suit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: title */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 96, fontWeight: 900, color: '#111111', letterSpacing: -2, lineHeight: 1, fontFamily: 'monospace' }}>
            BACCARAT
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#888880', marginTop: 8, fontFamily: 'monospace' }}>
            Single-player baccarat on Base - record your score on-chain
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
