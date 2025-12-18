import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@/generated/prisma/internal/prismaNamespace";


export function PrismaErrors(err: unknown): never {
  if (err instanceof PrismaClientKnownRequestError) {
    console.error('[PRISMA]', err.code, err.meta)
    throw err
  }

  if (err instanceof PrismaClientValidationError) {
    console.error('[PRISMA VALIDATION]', err.message)
    throw err
  }

  if (err instanceof PrismaClientUnknownRequestError) {
    console.error('[PRISMA UNKNOWN]', err.message)
    throw err
  }

  throw err instanceof Error ? err : new Error('Erro desconhecido')
}

