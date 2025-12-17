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
    const task = await prisma.task.findUnique({where: {id: taskId}})

    if (!task) {
    throw new Error('TASK_NOT_FOUND')
    }


    const updatedTask = await prisma.task.update({
      where: {id: taskId, userId}, 
      data: {
        title: data.title,
        description: data.description, 
        status: data.status
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
    const task = await prisma.task.findUnique({where: {id: taskId}})

    if(!task) throw new Error('Task não encontrada')
    
    return await prisma.task.delete({
      where: {
        id: taskId, 
        userId: userId
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
    return await prisma.task.findUniqueOrThrow({
      where: {
        id: taskId, 
        userId: userId
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

export async function findAllTasksByUser(
  userId: string
): Promise<TaskResponse[]> {
  try { 
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId
      }
    })

    if(!tasks) throw new Error('Tasks não encontradas para este usuário')

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