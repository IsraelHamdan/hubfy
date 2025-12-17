import { deleteTask, findById, updateTask } from "@/app/lib/services/tasks.service";
import { updateTaskSchema } from "@/app/lib/validatiors/tasks.schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {id: string}
}

export async function GET(_: NextRequest, {params} : Params): Promise<NextResponse> {
  try { 
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if(!userId) {
      return NextResponse.json(
        {message: 'Usuário não autenticado'}, 
        {status: 401}
      )
    }

    const task = await findById(params.id, userId)

    return NextResponse.json(task)

  } catch (err) {
    if(err instanceof Error) {
      if(err.message === 'TASK_NOT_FOUND') {
        return NextResponse.json(
          {message: "Task não encontrada"},
          {status: 404}
        )
      }
    }
    return NextResponse.json(
      { message: 'Erro ao criar task' },
      { status: 500 }
    )
  }
  
}

export async function PATCH(req: NextRequest, {params}: Params): Promise<NextResponse> {
  try { 
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

    const task = await updateTask(params.id, userId, updatedData)
    return NextResponse.json(
      task, 
      {status: 200}
    )
  } catch (err) {
    if(err instanceof Error) {
      if(err.message === 'TASK_NOT_FOUND') {
        return NextResponse.json(
          {message: "Task não encontrada"},
          {status: 404}
        )
      }
    }
    return NextResponse.json(
      { message: 'Erro ao criar task' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, {params}: Params): Promise<NextResponse> {
  try { 
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if(!userId) {
      return NextResponse.json(
        {message: 'Usuário não autenticado'}, 
        {status: 401}
      )
    }

    const deletedTask = await deleteTask(params.id, userId)

    return NextResponse.json(
      deletedTask, 
      {status: 200}
    )
  } catch (err) {
    if(err instanceof Error) {
      if(err.message === 'TASK_NOT_FOUND') {
        return NextResponse.json(
          {message: "Task não encontrada"},
          {status: 404}
        )
      }
    }
    return NextResponse.json(
      { message: 'Erro ao criar task' },
      { status: 500 }
    )
  }
}