import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@/generated/prisma/internal/prismaNamespace";


export function PrismaErrors(err: unknown) {
  if(err instanceof PrismaClientValidationError) {
    throw err.message
  }

  if(err instanceof PrismaClientKnownRequestError) {
    throw err.message
  }

  if(err instanceof PrismaClientUnknownRequestError) {
    throw err.message
  }

}