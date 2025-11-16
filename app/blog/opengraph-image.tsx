import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Bright4Event Blog - Kiến thức & Kinh nghiệm tổ chức sự kiện'
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

        {/* Radial light effect - center */}
        <div
          style={{
            position: 'absolute',
            top: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Watermark Crown - top right */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 60,
            fontSize: 60,
            opacity: 0.15,
            display: 'flex',
          }}
        >
          👑
        </div>

        {/* Blog Icon */}
        <div
          style={{
            fontSize: 90,
            marginBottom: 15,
            display: 'flex',
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.5))',
          }}
        >
          📰
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: 85,
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
          Bright4Event Blog
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            color: '#E5E5E5',
            textAlign: 'center',
            marginBottom: 10,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            display: 'flex',
          }}
        >
          Kiến thức – Kinh nghiệm – Xu hướng
        </div>

        <div
          style={{
            fontSize: 28,
            color: '#AAAAAA',
            textAlign: 'center',
            fontWeight: 400,
            display: 'flex',
          }}
        >
          tổ chức sự kiện chuyên nghiệp
        </div>

        {/* Blog topics */}
        <div
          style={{
            display: 'flex',
            gap: 30,
            marginTop: 50,
            fontSize: 22,
            color: '#FFD700',
            fontWeight: 600,
          }}
        >
          <div style={{
            padding: '10px 20px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: 20,
            border: '1px solid rgba(255,215,0,0.3)',
            display: 'flex',
          }}>
            💡 Hướng dẫn
          </div>
          <div style={{
            padding: '10px 20px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: 20,
            border: '1px solid rgba(255,215,0,0.3)',
            display: 'flex',
          }}>
            🎯 Case Study
          </div>
          <div style={{
            padding: '10px 20px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: 20,
            border: '1px solid rgba(255,215,0,0.3)',
            display: 'flex',
          }}>
            📊 Xu hướng
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
          bright4event.com/blog
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
