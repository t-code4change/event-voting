import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Bright4Event - Nền tảng tổ chức sự kiện All-in-One'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D0D1A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Background Pattern - Grid dots */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Radial light effect - top left */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Radial light effect - bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 450,
            height: 450,
            background: 'radial-gradient(circle, rgba(253,188,49,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Crown Icon */}
        <div
          style={{
            fontSize: 100,
            marginBottom: 10,
            display: 'flex',
            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))',
          }}
        >
          👑
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #FFD700 0%, #FDBC31 50%, #FFD700 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 15,
            letterSpacing: '-0.02em',
            display: 'flex',
          }}
        >
          Bright4Event
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#E5E5E5',
            textAlign: 'center',
            marginBottom: 50,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            display: 'flex',
          }}
        >
          Nền tảng tổ chức sự kiện All-in-One
        </div>

        {/* Features - 3 columns */}
        <div
          style={{
            display: 'flex',
            gap: 50,
            fontSize: 26,
            color: '#FFD700',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              background: '#FFD700',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255,215,0,0.8)',
            }} />
            QR Check-in
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              background: '#FFD700',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255,215,0,0.8)',
            }} />
            Vote Realtime
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              background: '#FFD700',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255,215,0,0.8)',
            }} />
            Lucky Draw
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 400,
            right: 400,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)',
            opacity: 0.4,
          }}
        />

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 35,
            fontSize: 18,
            color: '#888',
            fontWeight: 500,
            letterSpacing: '0.02em',
            display: 'flex',
          }}
        >
          bright4event.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
