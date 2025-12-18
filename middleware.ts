import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from './app/lib/services/token.service';


export async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl

  if (
    pathname === '/api/auth/register' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/refresh'
  ) {
    return NextResponse.next()
  }
  const token = req.cookies.get('access_token')?.value

  try { 
    if (!token ) {
      return NextResponse.json(
        { message: 'Token ausente' },
        { status: 401 }
      )
    }

    const payload = await verifyAccessToken(token)

    const response = NextResponse.next()

    response.headers.set('x-user-id', payload.sub)

    return response

  } catch {
    return NextResponse.json(
      { message: 'Access token inválido ou expirado' },
      { status: 401 }
    )
  }

}

export const config = {
  matcher: '/api/:path*',
}
