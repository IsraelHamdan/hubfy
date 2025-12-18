import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token'

export function setCSRF(res: NextResponse){
  const token = randomUUID()
  res.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === 'production', 
    path: '/'
  })

  return token
}


export function verifyCsrf(req: NextRequest) {
  const csrfCookie = req.cookies.get('csrf_token')?.value
  const csrfHeader = req.headers.get('x-csrf-token')

  if (!csrfCookie) {
    throw new Error('CSRF_COOKIE_MISSING')
  }

  if (!csrfHeader) {
    throw new Error('CSRF_HEADER_MISSING')
  }

  if (csrfCookie !== csrfHeader) {
    throw new Error('CSRF_INVALID')
  }
}
