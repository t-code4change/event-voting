import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Bảng giá Bright4Event - Linh hoạt & Tối ưu chi phí'
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

        {/* Spotlight effect - left */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: -100,
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Spotlight effect - right */}
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            right: -100,
            width: 450,
            height: 450,
            background: 'radial-gradient(circle, rgba(253,188,49,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo at top */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 40, display: 'flex' }}>👑</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #FFD700 0%, #FDBC31 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            }}
          >
            Bright4Event
          </div>
        </div>

        {/* Pricing Icon */}
        <div
          style={{
            fontSize: 90,
            marginBottom: 15,
            display: 'flex',
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))',
          }}
        >
          💳
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #FFD700 0%, #FDBC31 50%, #FFD700 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
            letterSpacing: '-0.02em',
            display: 'flex',
          }}
        >
          Bảng Giá Bright4Event
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            color: '#E5E5E5',
            textAlign: 'center',
            marginBottom: 50,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            display: 'flex',
          }}
        >
          Linh hoạt – Rõ ràng – Tối ưu chi phí sự kiện
        </div>

        {/* Pricing tiers mini cards */}
        <div
          style={{
            display: 'flex',
            gap: 25,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <div style={{
            padding: '15px 25px',
            background: 'rgba(34,197,94,0.15)',
            borderRadius: 12,
            border: '2px solid rgba(34,197,94,0.4)',
            color: '#4ADE80',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
          }}>
            <div style={{ fontSize: 24, display: 'flex' }}>✨</div>
            <div style={{ display: 'flex' }}>Free</div>
          </div>

          <div style={{
            padding: '15px 25px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: 12,
            border: '2px solid rgba(255,215,0,0.3)',
            color: '#FFD700',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
          }}>
            <div style={{ fontSize: 24, display: 'flex' }}>📦</div>
            <div style={{ display: 'flex' }}>Basic</div>
          </div>

          <div style={{
            padding: '15px 25px',
            background: 'rgba(255,215,0,0.2)',
            borderRadius: 12,
            border: '2px solid rgba(255,215,0,0.6)',
            color: '#FFD700',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
          }}>
            <div style={{ fontSize: 24, display: 'flex' }}>👑</div>
            <div style={{ display: 'flex' }}>Pro</div>
          </div>

          <div style={{
            padding: '15px 25px',
            background: 'rgba(255,215,0,0.15)',
            borderRadius: 12,
            border: '2px solid rgba(255,215,0,0.4)',
            color: '#FDBC31',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
          }}>
            <div style={{ fontSize: 24, display: 'flex' }}>🚀</div>
            <div style={{ display: 'flex' }}>Enterprise</div>
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
          bright4event.com/pricing
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
