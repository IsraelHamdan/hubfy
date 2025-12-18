import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/login/route'
import { login } from '@/app/lib/services/auth.service'
import { setAuthCookies } from '@/app/lib/services/cookie.service';

jest.mock('@/app/lib/services/auth.service', () => ({
  login: jest.fn(),
}))

jest.mock('@/app/lib/services/cookie.service', () => ({
  setAuthCookies: jest.fn(),
}))

describe('POST /auth/login', () => {
  it('deve autenticar o usuário e setar cookie', async () => {
    ;(login as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-id',
        name: 'User',
        email: 'user@test.com',
        createdAt: new Date(),
      },
      token: 'fake-jwt',
    })

    const req = new NextRequest(
      'http://localhost/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@test.com',
          password: '123456',
        }),
        headers: { 'content-type': 'application/json' },
      }
    )

    const res = await POST(req)

    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.user.email).toBe('user@test.com')
  })

  it('deve retornar 403 se credenciais forem inválidas', async () => {
    ;(login as jest.Mock).mockRejectedValue(
      new Error('INVALID_CREDENTIALS')
    )

    const req = new NextRequest(
      'http://localhost/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@test.com',
          password: 'errada',
        }),
        headers: { 'content-type': 'application/json' },
      }
    )

    const res = await POST(req)

    expect(res.status).toBe(403)
  })
})


