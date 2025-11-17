import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Liên hệ Bright4Event - Hỗ trợ tận tâm 24/7'
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

        {/* Soft radial light effect - center */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Logo at top center */}
        <div
          style={{
            position: 'absolute',
            top: 50,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 50, display: 'flex' }}>👑</div>
          <div
            style={{
              fontSize: 32,
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

        {/* Support Icon */}
        <div
          style={{
            fontSize: 90,
            marginBottom: 20,
            display: 'flex',
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))',
          }}
        >
          💬
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: 75,
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
          Liên hệ Bright4Event
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
          Chúng tôi luôn sẵn sàng hỗ trợ bạn
        </div>

        {/* Contact methods */}
        <div
          style={{
            display: 'flex',
            gap: 35,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '18px 28px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: 16,
            border: '2px solid rgba(255,215,0,0.3)',
          }}>
            <div style={{ fontSize: 40, display: 'flex' }}>☎️</div>
            <div style={{ color: '#FFD700', display: 'flex' }}>Hotline</div>
            <div style={{ fontSize: 16, color: '#AAAAAA', display: 'flex' }}>24/7</div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '18px 28px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: 16,
            border: '2px solid rgba(255,215,0,0.3)',
          }}>
            <div style={{ fontSize: 40, display: 'flex' }}>📧</div>
            <div style={{ color: '#FFD700', display: 'flex' }}>Email</div>
            <div style={{ fontSize: 16, color: '#AAAAAA', display: 'flex' }}>Support</div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '18px 28px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: 16,
            border: '2px solid rgba(255,215,0,0.3)',
          }}>
            <div style={{ fontSize: 40, display: 'flex' }}>💬</div>
            <div style={{ color: '#FFD700', display: 'flex' }}>Live Chat</div>
            <div style={{ fontSize: 16, color: '#AAAAAA', display: 'flex' }}>Tức thì</div>
          </div>
        </div>

        {/* Trust badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            fontSize: 18,
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{
            width: 8,
            height: 8,
            background: '#4ADE80',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(74,222,128,0.8)',
          }} />
          Phản hồi trong vòng 5 phút
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
          bright4event.com/contact
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
