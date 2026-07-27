import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`,
    "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
    "img-src 'self' data: blob: https: https://www.googleadservices.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://adservice.google.com https://www.googleadservices.com https://ip-api.com https://ipwho.is https://www.googleapis.com https://fonts.googleapis.com",
    "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "upgrade-insecure-requests",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: { headers: requestHeaders }
  })

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
