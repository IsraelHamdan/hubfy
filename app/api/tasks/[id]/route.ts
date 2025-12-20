import { deleteTask, findById, updateTask } from "@/app/lib/services/tasks.service";
import { updateTaskSchema } from "@/app/lib/validatiors/tasks.schema";
import { PrismaClientValidationError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";


//testado: funciona
export const dynamic = 'force-dynamic'
export async function GET(
  req: NextRequest, 
 {params}: {params: {id: string}}
): Promise<NextResponse> {
  try { 
    const id = params.id
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if(!userId) {
      return NextResponse.json(
        {message: 'Usuário não autenticado'}, 
        {status: 401}, 
      )
    }

    const task = await findById(id, userId)

    return NextResponse.json(task, {
      headers: {
        'Cache-Control': 'no-store'
      }
    })


  } catch (err) {
    if(err instanceof Error) {
      if(err.message === 'TASK_NOT_FOUND') {
        return NextResponse.json(
          {message: "Task não encontrada"},
          {status: 404}
        )
      }
      if (err.message === 'FORBIDDEN') {
        return NextResponse.json(
          { message: 'Acesso negado' },
          { status: 403 }
        )
      }

      if(err.message === 'USER_NOT_FOUND') {
        return NextResponse.json(
          {message: `Erro ao buscar task: ${err.message}`},
          {status: 401}
        )
      }
    }

    return NextResponse.json(
      { message: `Erro ao criar task: ${err}` },
      { status: 500 }
    )
  }
  
}

//testado: funciona
export async function PATCH(
  req: NextRequest, 
  {params}: {params: {id: string}}
): Promise<NextResponse> {
  try { 
    const id =  params.id

    console.log('taskId:', id)

    const body = await req.json()

    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if(!userId) {
      return NextResponse.json(
        {message: 'Usuário não autenticado'}, 
        {status: 401}
      )
    }

    const updatedData = updateTaskSchema.parse(body)

    const task = await updateTask(id, userId, updatedData)
    return NextResponse.json(
      task, 
      {status: 200}
    )
  } catch (err) {
    if(err instanceof Error) {
      if( err instanceof PrismaClientValidationError) {
        return NextResponse.json(
          {message: `Dados inválidos para atualização ${err.message}`},
          {status: 400}
        )
      }
      if(err.message === 'TASK_NOT_FOUND') {
        return NextResponse.json(
          {message: "Task não encontrada"},
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

    if(err instanceof ZodError) {
      return NextResponse.json(
        {message: `Erro na validação: ${err.message}`},
        {status: 400}
      )
    }
    return NextResponse.json(
      { message: `Erro ao atualizar task ${err}`},
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest, 
  {params}: {params: {id: string}}
): Promise<NextResponse> {
  try { 
    const id = params.id
    console.log("🚀 ~ DELETE ~ id:", id)

    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if(!userId) {
      return NextResponse.json(
        {message: 'Usuário não autenticado'}, 
        {status: 401}
      )
    }

    await deleteTask(id, userId)

    return new NextResponse(
      null,
      {status: 204}
    )
    
  } catch (err) {
    if(err instanceof Error) {
      if(err.message === 'TASK_NOT_FOUND') {
        return NextResponse.json(
          {message: "Task não encontrada"},
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