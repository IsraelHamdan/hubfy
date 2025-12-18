import { verifyPassowrd } from "@/app/lib/services/argon.service";
import { login } from "@/app/lib/services/auth.service";
import { sing } from "@/app/lib/services/token.service";
import {findUserByEmail } from "@/app/lib/services/user.service";

jest.mock('@/app/lib/services/user.service', () => ({
  findUserByEmail: jest.fn(), 
  createUser: jest.fn(), 
}))

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('@/app/lib/services/argon.service', () => ({
  verifyPassowrd: jest.fn(),
  hashPassoword: jest.fn()
}))

jest.mock('@/app/lib/services/token.service', () => ({
  sing: jest.fn()
}))

describe('AuthService - login', () => {
  const mockUser = {
    id: 'user-id',
    name: 'User',
    email: 'user@test.com',
    password: 'hashed-password',
    createdAt: new Date(),
  }


  it('Deve autenticar o usuário e retornar o token', async () => {
    ;(findUserByEmail as jest.Mock).mockResolvedValue(mockUser)
    ;(verifyPassowrd as jest.Mock).mockResolvedValue(true)
    ;(sing as jest.Mock).mockResolvedValue('fake-jwt')

    const result = await login({
      email: 'user@test.com',
      password: '12345678'
    })
    
    expect(result.user.email).toBe('user@test.com')
    expect(result.token).toBe('fake-jwt')
  })

  it('Deve lançar erro se o usuário não existir', async () => {
    ;(findUserByEmail as jest.Mock).mockResolvedValue(null)

    await expect(
      login({email: 'x@test.com', password: '12345678'})
    ).rejects.toThrow('USER_NOT_FOUND')
  })

  it('Deve lançar erro se a senha for inválida', async () => {
    ;(findUserByEmail as jest.Mock).mockResolvedValue(mockUser)
    ;(verifyPassowrd as jest.Mock).mockResolvedValue(false)

    await expect(
      login({email: 'user@test.com', password: '1234678'})
    ).rejects.toThrow('INVALID_CREDENTIALS')

  })
})

