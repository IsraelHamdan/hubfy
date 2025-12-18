import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@/generated/prisma/internal/prismaNamespace";
import { prisma } from "../prisma";
import { CreateUserDTO, UpdateUserDTO, User, UserResponseDTO } from "../validatiors/user.schema";
import { hashPassoword } from "./argon.service";
import { PrismaErrors } from "@/utils/prisma-errors";
import { signRefresh, sing, TokenPayload } from "./token.service";
import { AuthResponse } from "@/types/auth.types";

export async function createUser(data: CreateUserDTO): Promise<AuthResponse> {
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

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email
    }

    const accessToken = await sing(payload)
    const refreshToken = await signRefresh(payload)
    
    return {
      user: {
        id: user.id,
        name: user.name, 
        email: user.email, 
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    }
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

export async function findUserById(id: string): Promise<UserResponseDTO> {
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


export async function findUserByEmail(email: string): Promise<User> {
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

export async function updateUser(data: UpdateUserDTO, id: string): Promise<UserResponseDTO> {
  try { 
    return await prisma.user.update({
      where: {id}, 
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

export async function deleteUser(id: string) {
  try { 
    const user = await findUserById(id)
    if(!user) throw new Error("Usuário não encotnrado")
    return await prisma.user.delete({
      where: {id: id}
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