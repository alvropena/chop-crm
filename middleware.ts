import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth routes handling
  if (req.nextUrl.pathname.startsWith('/auth/')) {
    if (session) {
      // If user is signed in and tries to access auth pages, redirect to home
      return NextResponse.redirect(new URL('/', req.url))
    }
    // Allow access to auth pages for non-authenticated users
    return res
  }

  // Protected routes handling
  if (!session) {
    // If user is not signed in, redirect to sign in page
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}