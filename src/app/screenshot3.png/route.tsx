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
          fontFamily: 'monospace',
          paddingTop: 60,
          paddingBottom: 60,
          paddingLeft: 48,
          paddingRight: 48,
        }}
      >
        <div style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#111111', letterSpacing: -1 }}>BACCARAT</div>
        <div style={{ display: 'flex', fontSize: 20, color: '#888880', marginBottom: 60 }}>BASE MAINNET</div>

        {/* Cash out screen */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 80, fontWeight: 900, color: '#111111', lineHeight: 1 }}>CASHED</div>
            <div style={{ display: 'flex', fontSize: 80, fontWeight: 900, color: '#111111', lineHeight: 1 }}>OUT</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid #33333333', paddingTop: 40, gap: 28 }}>
            {[
              { label: 'FINAL CHIPS', value: '1,240' },
              { label: 'HANDS PLAYED', value: '18' },
              { label: 'WINS', value: '10 (55%)' },
              { label: 'PEAK CHIPS', value: '1,380' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ display: 'flex', fontSize: 18, color: '#888880', letterSpacing: 2 }}>{label}</span>
                <span style={{ display: 'flex', fontSize: 36, fontWeight: 900, color: '#111111' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
            <div style={{ display: 'flex', padding: 40, backgroundColor: '#111111', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ display: 'flex', fontSize: 24, fontWeight: 900, color: '#ece8de', letterSpacing: 3 }}>RECORD ON BASE</span>
            </div>
            <div style={{ display: 'flex', padding: 36, border: '2px solid #33333355', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: '#111111', letterSpacing: 3 }}>PLAY AGAIN</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 },
  );
}
