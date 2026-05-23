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
            width: 120,
            height: 120,
            border: '6px solid #111111',
            backgroundColor: '#f5f2ea',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 900,
              color: '#111111',
              fontFamily: 'serif',
              lineHeight: 1,
            }}
          >
            B
          </div>
        </div>
      </div>
    ),
    { width: 200, height: 200 },
  );
}
