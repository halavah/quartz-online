import { NextResponse } from 'next/server'

// Force static export compatibility
export const dynamic = 'force-static'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'quartz-online'
  })
}
