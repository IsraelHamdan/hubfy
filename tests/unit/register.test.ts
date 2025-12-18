import { prisma } from "@/app/lib/prisma";
import { hashPassoword } from "@/app/lib/services/argon.service";
import { createUser } from "@/app/lib/services/user.service";
import { signRefresh, sing } from "@/app/lib/services/token.service";
import { refresh } from "next/cache";

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('@/app/lib/services/argon.service', () => ({
  hashPassoword: jest.fn()
}))

jest.mock('@/app/lib/services/token.service', () => ({
  sing: jest.fn(), 
  signRefresh: jest.fn()
}))

describe('AuthServie - CreateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Deve criar um usuário com sucesso', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(hashPassoword as jest.Mock).mockResolvedValue('hashed-password')

    const mockUser = {
      id: 'user-id',
      name: 'User',
      email: 'user@test.com',
      password: 'hashed-password',
    }

    ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)
    ;(sing as jest.Mock).mockResolvedValue('fake-token')
    ;(signRefresh as jest.Mock).mockResolvedValue('fake-refresh')

    const result = await createUser({
      name: 'User', 
      email: 'user@test.com', 
      password: 'plain-password'
    })

    expect(result).toMatchObject({
      user: {
        id: 'user-id',
        name: 'User',
        email: 'user@test.com',
      },
      accessToken: 'fake-token',
      refreshToken: 'fake-refresh'
    })

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'user@test.com' }
    })
    expect(hashPassoword).toHaveBeenCalledWith('plain-password')
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'User',
        email: 'user@test.com',
        password: 'hashed-password'
      }
    })
    expect(sing).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'user@test.com'
    })

  }) 

  it('deve lançar erro se o email já existir', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'existing-id',
      email: 'user@test.com'
    })

    await expect(
      createUser({
        name: 'User',
        email: 'user@test.com',
        password: 'plain-password',
      })
    ).rejects.toThrow('EMAIL_ALREADY_EXISTS')
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('deve propagar erro do Prisma', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(hashPassoword as jest.Mock).mockResolvedValue('hashed-password')

    ;(prisma.user.create as jest.Mock).mockRejectedValue(
      new Error('DB_ERROR')
    )

    await expect(
      createUser({
        name: 'User',
        email: 'user@test.com',
        password: 'plain-password',
      })
    ).rejects.toThrow()
  })


})