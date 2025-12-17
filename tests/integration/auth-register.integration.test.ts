import { POST } from '@/app/api/auth/register/route'
import { NextRequest } from 'next/server'
import { setAuthCookie } from '@/app/lib/services/cookie.service'

jest.mock('@/app/lib/services/token.service', () => ({
  sing: jest.fn().mockResolvedValue('fake-jwt-token'),
}))

jest.mock('@/app/lib/services/user.service', () => ({
  createUser: jest.fn().mockResolvedValue({
    id: 'user-id-123',
    name: 'User Test',
    email: 'user@test.com',
    createdAt: new Date(),
  }),
}))

jest.mock('@/app/lib/services/cookie.service', () => ({
  setAuthCookie: jest.fn(),
}))

function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  })
}

describe('Auth - Register (Teste de integração da rota)', () => {
  it('Deve registrar o usuário e chamar o setAuthCookie com o token', async () => {
    const req = createRequest({
      name: 'User Test',
      email: 'user@test.com',
      password: 'Password123',
    })

    const res = await POST(req)

    expect(res.status).toBe(201)

    const body = await res.json()
    expect(body.email).toBe('user@test.com')

    expect(setAuthCookie).toHaveBeenCalledWith({
      response: expect.any(Response),
      token: 'fake-jwt-token',
    })
  })
})
