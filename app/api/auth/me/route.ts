
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from "@/app/lib/auth/auth.constants";
import { TokenPayload, verifyAccessToken } from "@/app/lib/services/token.service";
import { findUserById } from "@/app/lib/services/user.service";


export async function GET(req: NextRequest): Promise<NextResponse> {
  try { 
    const cookiesStore = await cookies()
    const accessToken = cookiesStore.get(AUTH_COOKIE_NAME)?.value

    if(!accessToken) {
      return NextResponse.json(
        {message: 'Usuário não autenticado'},
        {status: 401}
      )
    }

    const payload: TokenPayload = await verifyAccessToken(accessToken)

    const user = await findUserById(payload.sub)

    if(!user) {
      return NextResponse.json(
        {message: "USER_NOT_FOUND"}, 
        {status: 404}
      )
    }

    return NextResponse.json(
      user, 
      {status: 200}
    )

  } catch {
    return NextResponse.json(
      {messaage: 'Token inválido ou expirado'},
      {status: 401}
    )
  }
}