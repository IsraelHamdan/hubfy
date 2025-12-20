import { setAuthCookies } from "@/app/lib/services/cookie.service";
import { createUser } from "@/app/lib/services/user.service";
import { createUserSchema, } from "@/app/lib/validatiors/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST (req: NextRequest): Promise<NextResponse> {
  try { 
    const body = await req.json() 
    
    const data = createUserSchema.parse(body)

    const {user, accessToken, refreshToken} = await createUser(data)

    const responsePayload = process.env.NODE_ENV !== 'production' 
      ? {user, accessToken, refreshToken} : {user}

    const response = NextResponse.json(
      responsePayload, 
      { status: 201 }
    )

    setAuthCookies({
      response, accessToken, refreshToken
    })

    return response
  } catch(err: unknown) {
    if(err instanceof ZodError) {
      // ✅ Retorna os erros do Zod em formato legível
      return NextResponse.json({
        message: 'Dados inválidos',
        errors: err.issues
      }, { status: 400 })
    }

    if (err instanceof Error && err.message === 'EMAIL_ALREADY_EXISTS') {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}