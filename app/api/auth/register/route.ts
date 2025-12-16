import { setAuthCookie } from "@/app/lib/services/cookie.service";
import { sing } from "@/app/lib/services/token.service";
import { createUser } from "@/app/lib/services/user.service";
import { createUserSchema, } from "@/app/lib/validatiors/user.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST (req: NextRequest): Promise<NextResponse> {
  try { 
    const body = await req.json() 

    const data = createUserSchema.parse(body)

    const user = await createUser(data)

    const token = await sing({
      sub: user.id, 
      email: user.email
    })

    const responseBody: Record<string, unknown> = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    const response = NextResponse.json(
      responseBody, 
       {status: 201}
    )

    if (process.env.NODE_ENV !== 'production') {
      responseBody.token = token
    }

    setAuthCookie({
      response, token 
    })

    return response 
  } catch(err: unknown) {
    if(err instanceof ZodError) {
      return NextResponse.json({
        messsage: err.message,
        cause: err.cause
      })
    }

    if (err.message === 'EMAIL_ALREADY_EXISTS') {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: err.message ?? 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}