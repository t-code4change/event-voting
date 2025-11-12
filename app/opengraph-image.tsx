import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Bright4Event - Hệ thống Bình chọn Sự kiện Chuyên Nghiệp'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a1a 50%, #0D0D1A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,215,0,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Crown Icon (simulated with text) */}
        <div
          style={{
            fontSize: 120,
            marginBottom: 20,
            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
          }}
        >
          👑
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #FFD700 0%, #FDB931 50%, #FFD700 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          Bright4Event
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#FAF3E0',
            textAlign: 'center',
            padding: '0 60px',
            lineHeight: 1.4,
          }}
        >
          Hệ thống Bình chọn Sự kiện Chuyên Nghiệp
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 30,
            marginTop: 40,
            fontSize: 24,
            color: '#FFD700',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            ✓ QR Check-in
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            ✓ Vote Realtime
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            ✓ Lucky Draw
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#999',
          }}
        >
          quaysotrungthuong.vn
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
