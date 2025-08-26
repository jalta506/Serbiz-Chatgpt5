import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/admin/:path*']
}

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get('serbiz_session')
  if (!cookie) return NextResponse.redirect(new URL('/login', req.url))
  // Light client-side guard; server also checks role in the page itself
  return NextResponse.next()
}
