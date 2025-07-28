// app/api/generate-share-image/route.tsx

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const username = searchParams.get('username') ?? 'Player'
  const pfpUrl = searchParams.get('pfpUrl') ?? ''
  const moves = searchParams.get('moves') ?? '0'
  const time = searchParams.get('time') ?? '0:00'

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          color: '#FFFFFF',
          backgroundColor: '#824DD9',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {pfpUrl ? (
          <img
            src={pfpUrl}
            width={120}
            height={120}
            style={{
              borderRadius: '50%',
              marginBottom: 20,
              border: '3px solid white',
              objectFit: 'cover',
            }}
          />
        ) : null}
        <div style={{ fontWeight: 700, fontSize: 64 }}>{username} Wins! 🎉</div>
        <div style={{ marginTop: 40, fontSize: 36 }}>
          Moves: <span>{moves}</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 36 }}>
          Time: <span>{time}</span>
        </div>
        <div style={{ marginTop: 60, fontSize: 28, color: '#D7CBFF' }}>
          Can you beat my score? Play BrainFlip now!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  )
}
