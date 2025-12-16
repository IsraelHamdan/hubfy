import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from './app/lib/services/token.service';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)


export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.headers.set('Access-Control-Allow-Credentials', 'true')

  // Preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers })
  }

  const pathname = req.nextUrl.pathname

    if (
    req.nextUrl.pathname === '/api/auth/register' ||
    req.nextUrl.pathname === '/api/auth/login'
  ) {
    return res
  }


  const token = req.cookies.get('acess_token')?.value

  if(!token) {
    return NextResponse.json(
      {message: 'Não autorizado'}, 
      {status: 401}
    )
  }

  try { 
    const {payload} = await jwtVerify(token, secret)

    const response = NextResponse.next()

    response.headers.set('x-user-id', String(payload.sub))

    return response

  } catch {
    return NextResponse.json(
      { message: 'Token inválido ou expirado' },
      { status: 401 }
    )
  }


}

export const config = {
  matcher: '/api/:path*',
}
