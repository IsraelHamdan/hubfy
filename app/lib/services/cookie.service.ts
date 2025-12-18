import { NextResponse } from 'next/server'
import { ACCESS_TOKEN_MAX_AGE, AUTH_COOKIE_NAME, AUTH_REFRESH_NAME } from '../auth/auth.constants';

interface SetAuthCookieParams {
  response: NextResponse
  accessToken: string, 
  refreshToken?: string
}

export function setAuthCookies({
  response,
  accessToken,
  refreshToken
}: SetAuthCookieParams) {
  response.cookies.set(
    AUTH_COOKIE_NAME, accessToken,  {
      httpOnly: true, 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', 
      path: '/'
    }
  )

  if(refreshToken) {
    response.cookies.set(AUTH_REFRESH_NAME, refreshToken, {
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === 'production', 
      path: '/'
    })
  }
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
  })
}
