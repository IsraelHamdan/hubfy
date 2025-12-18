import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { signRefresh, verifyAccessToken, verifyRefresh } from './app/lib/services/token.service';


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
  const refresh = req.cookies.get('refresh_token')?.value

  if(!token && !refresh) {
    return NextResponse.json(
      {message: 'Não autorizado'}, 
      {status: 401}
    )
  }

  try { 

    const payload = await verifyAccessToken(token!)

    const response = NextResponse.next()

    response.headers.set('x-user-id', payload.sub)

    return response

  } catch {
    if(!refresh) {
      return NextResponse.json(
        {message: 'Seção expirada'}, 
        {status: 401}
      )
    }
    try { 
      const payload = await verifyRefresh(refresh)

      const newAcess = await signRefresh({
        sub: payload.sub, 
        email: payload.email
      })

      const res = NextResponse.next()

      res.cookies.set('access_token', newAcess, {
        httpOnly: true, 
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', 
        path: '/'
      })

      res.headers.set('x-user-id', payload.sub)

      return res

    } catch {
      return NextResponse.json(
        {message: 'Seção Expirada'}, 
        {status: 401}
      )
    }

  }


}

export const config = {
  matcher: '/api/:path*',
}
