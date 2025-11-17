import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Hướng dẫn sử dụng Bright4Event - Từng bước triển khai sự kiện'
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

        {/* Radial light effect */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo at top */}
        <div
          style={{
            position: 'absolute',
            top: 45,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 45, display: 'flex', filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))' }}>👑</div>
          <div
            style={{
              fontSize: 30,
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

        {/* Guide Icon */}
        <div
          style={{
            fontSize: 85,
            marginBottom: 20,
            display: 'flex',
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))',
          }}
        >
          📋
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
          Hướng dẫn sử dụng
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
          Từng bước triển khai sự kiện chuyên nghiệp
        </div>

        {/* Steps */}
        <div
          style={{
            display: 'flex',
            gap: 30,
            fontSize: 20,
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
            <div style={{
              width: 45,
              height: 45,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FDBC31 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#0D0D1A',
            }}>1</div>
            <div style={{ color: '#FFD700', display: 'flex', fontSize: 18 }}>Đăng ký</div>
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
            <div style={{
              width: 45,
              height: 45,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FDBC31 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#0D0D1A',
            }}>2</div>
            <div style={{ color: '#FFD700', display: 'flex', fontSize: 18 }}>Tạo sự kiện</div>
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
            <div style={{
              width: 45,
              height: 45,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FDBC31 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#0D0D1A',
            }}>3</div>
            <div style={{ color: '#FFD700', display: 'flex', fontSize: 18 }}>Triển khai</div>
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
            <div style={{
              width: 45,
              height: 45,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FDBC31 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 900,
              color: '#0D0D1A',
            }}>4</div>
            <div style={{ color: '#FFD700', display: 'flex', fontSize: 18 }}>Thành công</div>
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
          bright4event.com/guide
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
