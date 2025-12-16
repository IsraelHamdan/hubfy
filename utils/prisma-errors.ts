import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@/generated/prisma/internal/prismaNamespace";


export function PrismaErrors(err: unknown):never {
  if(err instanceof PrismaClientValidationError) {
    throw new Error (err.message)
  }

  if(err instanceof PrismaClientKnownRequestError) {
    throw new Error (err.message)
  }

  if(err instanceof PrismaClientUnknownRequestError) {
    throw new Error (err.message)
  }
  throw new Error("Erro desconhecido")
}

