'use client';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_EMAILS } from '@/lib/admins';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('user')?.value

  if (currentUser) {
    const user = JSON.parse(currentUser)
    if (user && !ADMIN_EMAILS.includes(user.email)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
 
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/admin/:path*',
}
