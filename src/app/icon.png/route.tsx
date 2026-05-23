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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ece8de',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 600,
              height: 600,
              border: '24px solid #111111',
              backgroundColor: '#f5f2ea',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 280,
                fontWeight: 900,
                color: '#111111',
                fontFamily: 'serif',
                lineHeight: 1,
              }}
            >
              B
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 80,
              fontWeight: 700,
              color: '#111111',
              marginTop: 32,
              letterSpacing: 24,
              fontFamily: 'monospace',
            }}
          >
            BACCARAT
          </div>
        </div>
      </div>
    ),
    { width: 1024, height: 1024 },
  );
}
