import { POST } from "@/app/api/auth/register/route";
import { createUser } from "@/app/lib/services/user.service";
import { NextRequest } from "next/server";

jest.mock('@/app/lib/services/user.service', () => ({
  createUser: jest.fn()
}))

jest.mock('@/app/lib/services/cookie.service', () => ({
  setAuthCookie: jest.fn()
}))


describe('POST /auth/register', () => {
  it('Deve registrar um usuário com sucesso', async () => {
    ;(createUser as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-123',
        name: 'Fulano',
        email: 'fulano@test.com',
        createdAt: new Date('2025-01-03')
      },
      token: 'fake-jwt-token'
    })

    const req = new NextRequest(
      'http://localhost/api/auth/register', 
      {
        method: 'POST', 
        body: JSON.stringify({
          name: 'Fulano',
          email: 'fulano@test.com',
          password: '12345678'
        })
      }
    )

    const res = await POST(req)

    expect(res.status).toBe(201)

    const body = await res.json()
    expect(body.user).toMatchObject({
      id: 'user-123',
      name: 'Fulano',
      email: 'fulano@test.com'
    })

    if (process.env.NODE_ENV !== 'production') {
      expect(body.token).toBe('fake-jwt-token')
    }

    expect(createUser).toHaveBeenCalledWith({
      name: 'Fulano',
      email: 'fulano@test.com',
      password: '12345678'
    })
  })

  it(
    'Falha ao registrar um usuário com um email já cadastrado',
    async () => {
      ;(createUser as jest.Mock).mockRejectedValue(
        new Error('EMAIL_ALREADY_EXISTS')
      )
      const req = new NextRequest(
        'http://localhost/api/auth/register', 
        {
          method: 'POST', 
          body: JSON.stringify({
            name: 'Fulano',
            email: 'fulano@test.com',
            password: '12345678'
          })
        }
      ) 

      const res = await POST(req)
      expect(res.status).toBe(409)

      const body = await res.json()
      expect(body.message).toBe('Email já cadastrado')
    })

    it('Deve falhar com dados inválios (validação do Zod)', async () => {
      const req = new NextRequest(
        'http://localhost:3000/api/auth/register', 
        {
          method: 'POST', 
          body: JSON.stringify({
            name: 'A',  // Nome muito curto
            email: 'email-invalido',  // Email inválido
            password: '123'  // Senha muito curta
          })
        }
      )
      
      const res = await POST(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toBeDefined()
    })  

    it('Deve retornar erro 500 para erros inesperados', async () => {
    // Mock que lança erro genérico
    ;(createUser as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    )

    const req = new NextRequest(
      'http://localhost:3000/api/auth/register', 
      {
        method: 'POST', 
        body: JSON.stringify({
          name: 'Fulano',
          email: 'fulano@test.com',
          password: '12345678'
        })
      }
    )

    const res = await POST(req)

    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body.message).toBeDefined()
  })
})