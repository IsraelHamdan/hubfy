import { NextResponse } from "next/server";

export default function throwException(err: Error): NextResponse {
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

  return NextResponse.json(
    {message: 'Erro interno'},
    {status: 500}
  )
  
}