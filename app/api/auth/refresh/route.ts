import { signRefresh, verifyRefresh } from "@/app/lib/services/token.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try { 
    const refresh = req.cookies.get('refresh_token')?.value

    if (!refresh) {
      return NextResponse.json(
        { message: 'Refresh token ausente' },
        { status: 401 }
      )
    }

    const payload = await verifyRefresh(refresh)

    const newAcess = await signRefresh({
      sub: payload.sub, 
      email: payload.email
    })

    const res = NextResponse.json(
      {message: 'Token Renovado'},
      {status: 200}
    )

    res.cookies.set('access_token', newAcess, {
      httpOnly: true, 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', 
      path: '/'
    })

    
    return res

  } catch {
    return NextResponse.json(
      {message: 'Seção Expirada'}, 
      {status: 401}
    )
  }
}