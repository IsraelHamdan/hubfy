import { NextResponse } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, AUTH_COOKIE_NAME } from '../auth/auth.constants';

interface SetAuthCookieParams {
  response: NextResponse
  token: string
}

export function setAuthCookie({
  response,
  token,
}: SetAuthCookieParams) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE, // 1h
  })
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
  })
}
