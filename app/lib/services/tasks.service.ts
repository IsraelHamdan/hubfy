import { CreateTaskDTO, TaskResponse, UpdateTaskDTO } from "../validatiors/tasks.schema";
import { prisma } from "../prisma";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@/generated/prisma/internal/prismaNamespace";
import { PrismaErrors } from "@/utils/prisma-errors";
import { findUserById } from "./user.service";


export async function createTask(userId: string, data: CreateTaskDTO): Promise<TaskResponse> {
  try { 
    const user = await findUserById(userId)

    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }


    const newTask = await prisma.task.create({
      data: {
        title: data.title, 
        description: data.description, 
        status: data.status,
        user: {
          connect: {id: userId}
        }
      }
    })

    return newTask
  } catch(err) {
    if(
        err instanceof PrismaClientKnownRequestError ||
        err instanceof PrismaClientUnknownRequestError || 
        err instanceof PrismaClientValidationError
      ) {

        PrismaErrors(err)
    }
    throw err
  }
}

export async function updateTask(
  taskId: string, 
  userId: string,
  data:UpdateTaskDTO
): Promise<TaskResponse> {
  try { 
    const task = await findById(taskId, userId)
    console.log("🚀 ~ updateTask ~ ID DA TASK:", task.id)
    console.log(data)
    console.log(userId)

    if(!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    const updatedTask = await prisma.task.update({
      where: {id: taskId}, 
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
      
      }
    })

    return updatedTask
  } catch(err) {
        if(
        err instanceof PrismaClientKnownRequestError ||
        err instanceof PrismaClientUnknownRequestError || 
        err instanceof PrismaClientValidationError
      ) {

        PrismaErrors(err)
    }
    throw err

  }
}

export async function deleteTask(taskId: string, userId: string): Promise<TaskResponse> {
  try { 
    const task = await findById(taskId, userId)

    if(!task) throw new Error('Task não encontrada')
    
    return await prisma.task.delete({
      where: {
        id: taskId, 
      }
    })
  } catch(err) {
    if(
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError || 
      err instanceof PrismaClientValidationError
    ) {

    PrismaErrors(err)
   }
    throw err
  }
}

export async function findById(
  taskId: string, userId: string
): Promise<TaskResponse> {
  try { 
    const task = await prisma.task.findFirst({
      where: {
        id: taskId, 
        userId: userId
      }
    })

    if(!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    return task
  } catch(err) {
        if(
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError || 
      err instanceof PrismaClientValidationError
    ) {

    PrismaErrors(err)
   }
    throw err
  }
  
}

export async function findAllTasksByUser(
  userId: string
): Promise<TaskResponse[]> {
  try { 
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId
      }
    })
    return tasks
  } catch(err) {
        if(
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientUnknownRequestError || 
      err instanceof PrismaClientValidationError
    ) {

    PrismaErrors(err)
   }
    throw err
  }
}