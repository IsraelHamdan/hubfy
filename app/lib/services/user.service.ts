import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@/generated/prisma/internal/prismaNamespace";
import { prisma } from "../prisma";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../validatiors/user.schema";
import { hashPassoword } from "./argon.service";
import { PrismaErrors } from "../utils";

export async function createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
  try { 
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }
    const hashedPassoword = await hashPassoword(data.password) 

    const user = await prisma.user.create({
      data: {
        name: data.name, 
        email: data.email, 
        password: hashedPassoword
      }
    })

    return user 
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

export async function findUserById(id: number): Promise<UserResponseDTO> {
  try { 
    const user = await prisma.user.findUnique({where: {id: id}})
    if(!user) throw new Error("Usuário não encontrado")
    
    return user

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


export async function findUserByEmail(email: string): Promise<UserResponseDTO> {
  try { 
    return await prisma.user.findUniqueOrThrow({where: {email: email}})
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

export async function updateUser(data: UpdateUserDTO, id: number): Promise<UserResponseDTO> {
  try { 
    return await prisma.user.update({
      where: {id: id}, 
      data: data
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

export async function deleteUser(id: number) {
  try { 
    const user = await findUserById(id)
    if(!user) throw new Error("Usuário não encotnrado")
    return await prisma.user.delete({
      where: {id: id}
    })
  } catch(err) {
  }
}