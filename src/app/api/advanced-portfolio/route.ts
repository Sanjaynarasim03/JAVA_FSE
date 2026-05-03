import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const response = await fetch(`${BACKEND_URL}/generate-portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('authorization') ?? '',
      },
      body,
    })

    const payload = await response.json()
    return NextResponse.json(payload, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Failed to generate portfolio',
        allocations: [],
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/advanced-portfolio',
    proxyTarget: `${BACKEND_URL}/generate-portfolio`,
    method: 'POST',
    description: 'Proxy to the FastAPI RAMENS portfolio generator',
  })
}
