
import { createTask, findAllTasksByUser } from "@/app/lib/services/tasks.service";
import { createTaskSchema } from "@/app/lib/validatiors/tasks.schema";
import throwException from "@/utils/exceptions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try { 
    const body = await req.json()
    const data = createTaskSchema.parse(body)
    console.log("🚀 ~ POST ~ data:", data)

    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const task = await createTask(userId, data)

    return NextResponse.json(
      task, {status: 201}
    )

  } catch(err) {
    if(err instanceof Error) {
      return throwException(err)
    }

    if(err instanceof ZodError) {
      return NextResponse.json(
        {message: `Erro de validação do Zod: ${err.message}`}, 
        {status: 400}
      )
    }
    
    return NextResponse.json(
      { message: 'Erro ao criar task' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try { 
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { message: 'Usuário não autenticado' },
        { status: 401 }
      )
    }
    const tasks = await findAllTasksByUser(userId)

    return NextResponse.json(
      tasks, {status: 200}
    )

  } catch (err) {
    if(err instanceof Error) {
      if(err.message === 'USER_NOT_FOUND') {
        return NextResponse.json(
          {message: "Usuário não encontrado"},
          {status: 404}
        )
      }
      if (err.message === 'FORBIDDEN') {
        return NextResponse.json(
          { message: 'Acesso negado' },
          { status: 403 }
        )
      }
  
    }
    return NextResponse.json(
      { message: 'Erro ao criar task' },
      { status: 500 }
    )

  }
}