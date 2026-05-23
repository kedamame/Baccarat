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
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 32, paddingLeft: 48, paddingRight: 48, borderBottom: '2px solid #33333333' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#111111', letterSpacing: -1 }}>BACCARAT</div>
            <div style={{ display: 'flex', fontSize: 20, color: '#888880' }}>BACCARAT</div>
          </div>
          <div style={{ display: 'flex', fontSize: 16, color: '#888880', alignItems: 'flex-end' }}>BASE MAINNET</div>
        </div>

        {/* Empty hands - betting state */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 48, paddingBottom: 0, paddingLeft: 48, paddingRight: 48, gap: 40, flex: 1 }}>
          {['BANKER', 'PLAYER'].map((label) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', fontSize: 18, fontWeight: 700, color: '#888880', letterSpacing: 2 }}>{label}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[0, 1].map((i) => (
                  <div key={i} style={{ display: 'flex', width: 110, height: 165, border: '3px dashed #33333333' }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Betting panel */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 40, paddingBottom: 48, paddingLeft: 48, paddingRight: 48, borderTop: '4px solid #111111', gap: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'flex', fontSize: 16, color: '#888880', letterSpacing: 2 }}>CHIPS</span>
              <span style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#111111' }}>1,000</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ display: 'flex', fontSize: 16, color: '#888880', letterSpacing: 2 }}>BET</span>
              <span style={{ display: 'flex', fontSize: 44, fontWeight: 900, color: '#888880' }}>50</span>
            </div>
          </div>

          {/* Chip add buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {['10', '25', '50', '100', '200', '500'].map((chip) => (
              <div key={chip} style={{ display: 'flex', flex: 1, paddingTop: 18, paddingBottom: 18, paddingLeft: 4, paddingRight: 4, border: '2px solid #111111', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ display: 'flex', fontSize: 18, fontWeight: 700, color: '#111111' }}>{`+${chip}`}</span>
              </div>
            ))}
          </div>

          {/* Bet type buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'PLAYER', odds: '1:1', selected: true },
              { label: 'BANKER', odds: '0.95:1', selected: false },
              { label: 'TIE', odds: '8:1', selected: false },
            ].map(({ label, odds, selected }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flex: 1,
                  paddingTop: 24,
                  paddingBottom: 24,
                  paddingLeft: 8,
                  paddingRight: 8,
                  border: `4px solid ${selected ? '#111111' : '#33333344'}`,
                  backgroundColor: selected ? '#111111' : 'transparent',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ display: 'flex', fontSize: 18, fontWeight: 700, color: selected ? '#ece8de' : '#111111', letterSpacing: 1 }}>{label}</span>
                <span style={{ display: 'flex', fontSize: 13, color: selected ? '#ece8de' : '#888880' }}>{odds}</span>
              </div>
            ))}
          </div>

          {/* Deal button */}
          <div style={{ display: 'flex', padding: 40, backgroundColor: '#111111', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ display: 'flex', fontSize: 28, fontWeight: 900, color: '#ece8de', letterSpacing: 6 }}>DEAL</span>
          </div>
        </div>
      </div>
    ),
    { width: 1284, height: 2778 },
  );
}
