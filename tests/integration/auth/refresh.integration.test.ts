import { POST } from "@/app/api/auth/refresh/route";
import { NextRequest } from "next/server";

jest.mock('@/app/lib/services/token.service', () => ({
  verifyRefresh: jest.fn(), 
  signRefresh: jest.fn()
}))

import { signRefresh, verifyRefresh } from "@/app/lib/services/token.service";

describe('POST /api/auth/refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renovar o access_token com refresh válido', async () => {
    (verifyRefresh as jest.Mock).mockResolvedValue({
      sub: 'user-id',
      email: 'user@email.com',
    })

    ;(signRefresh as jest.Mock).mockResolvedValue('new-access-token')

    const req = new NextRequest('http://localhost/api/auth/refresh', {
      headers: {
        cookie: 'refresh_token=valid-refresh',
      },
    })

    const res = await POST(req)

    expect(res.status).toBe(200)

    const cookies = res.headers.get('set-cookie')
    expect(cookies).toContain('access_token=new-access-token')
  })

  it('deve retornar 401 se não houver refresh_token', async () => {
    const req = new NextRequest('http://localhost/api/auth/refresh')

    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  it('deve retornar 401 se refresh_token for inválido', async () => {
    (verifyRefresh as jest.Mock).mockRejectedValue(new Error('Invalid token'))

    const req = new NextRequest('http://localhost/api/auth/refresh', {
      headers: {
        cookie: 'refresh_token=invalid-refresh',
      },
    })

    const res = await POST(req)

    expect(res.status).toBe(401)
  })
})