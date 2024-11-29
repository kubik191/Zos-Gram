import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Add routes that don't require authentication
const publicRoutes = [
  '/prihlasenie',
  '/registracia',
  '/podmienky',
  '/gdpr',
  '/', // Add the home page if you want it to be public
  '/o-nas', // Example of another public page
]

// Add routes that should always be public, even if the user is authenticated
const alwaysPublicRoutes = [
  '/podmienky',
  '/gdpr',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const path = request.nextUrl.pathname

  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))
  const isAlwaysPublicRoute = alwaysPublicRoutes.some(route => path.startsWith(route))

  if (!token && !isPublicRoute) {
    const url = new URL('/prihlasenie', request.url)
    url.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(url)
  }

  if (token && isPublicRoute && !isAlwaysPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

