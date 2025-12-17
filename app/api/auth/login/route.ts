import { login } from "@/app/lib/services/auth.service";
import { setAuthCookie } from "@/app/lib/services/cookie.service";
import { authSchema } from "@/app/lib/validatiors/auth.login";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try { 
    const body = await req.json()

    const data = authSchema.parse(body)

    const {user, token} = await login(data)

    const response = NextResponse.json(
      {user, token}, 
      {status: 200}
    )

    setAuthCookie({response, token})

    return response

  } catch(err) {
    if(err instanceof Error) {
      if(err.message === 'USER_NOT_FOUND') {
        return NextResponse.json(
          {message: "Usuário não encontrado"}, 
          {status: 404}
        )
      }
      
      if(err.message === 'INVALID_CREDENTIALS') {
        return NextResponse.json(
          {message: "Credenciais Inválidas"}, 
          {status: 403}
        )
      }
    }
    return NextResponse.json(
      {message:"Erro interno ao fazer login"},
      {status: 500}
    )
  }
  
}