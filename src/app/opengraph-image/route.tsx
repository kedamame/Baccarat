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
          paddingTop: 60,
          paddingBottom: 60,
          paddingLeft: 60,
          paddingRight: 60,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', fontSize: 14, color: '#888880', letterSpacing: 3, fontFamily: 'monospace' }}>
          BASE MAINNET / BACCARAT
        </div>

        {/* Cards — suits as ASCII (S, C) to avoid Satori font errors */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {[
            { rank: 'K', suit: 'S' },
            { rank: 'A', suit: 'C' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: 90,
                height: 130,
                border: '3px solid #111111',
                backgroundColor: '#f5f2ea',
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 7,
                paddingRight: 7,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 22, fontWeight: 700, color: '#111111', lineHeight: 1 }}>
                <span style={{ display: 'flex' }}>{c.rank}</span>
                <span style={{ display: 'flex' }}>{c.suit}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 22, fontWeight: 700, color: '#111111', lineHeight: 1, alignItems: 'flex-end', transform: 'rotate(180deg)' }}>
                <span style={{ display: 'flex' }}>{c.rank}</span>
                <span style={{ display: 'flex' }}>{c.suit}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, color: '#111111', letterSpacing: -1, lineHeight: 1, fontFamily: 'monospace' }}>
            BACCARAT
          </div>
          <div style={{ display: 'flex', fontSize: 16, color: '#888880', marginTop: 6, fontFamily: 'monospace' }}>
            Tap to play
          </div>
        </div>
      </div>
    ),
    { width: 900, height: 600 },
  );
}
