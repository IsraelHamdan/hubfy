import { prisma } from "@/app/lib/prisma";
import { hashPassoword } from "@/app/lib/services/argon.service";
import { createUser } from "@/app/lib/services/user.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock da função de hash
jest.mock('@/app/lib/services/argon.service', () => ({
  hashPassoword: jest.fn(),
}))

jest.mock('@/utils/utils', () => ({
  PrismaErrors: jest.fn(),
}))


describe('UserService - createUser', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Cenários de Sucesso', () => {
    it('deve criar um usuário com sucesso', async () => {
      // Arrange (Preparar)
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'Test123456',
      }

      const hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$...'
      const createdUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date(),
      }


      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      ;(hashPassoword as jest.Mock).mockResolvedValue(hashedPassword)

      ;(prisma.user.create as jest.Mock).mockResolvedValue(createdUser)

      const result = await createUser(userData)


      expect(result).toEqual(createdUser)
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      })
      expect(hashPassoword).toHaveBeenCalledTimes(1)
      expect(hashPassoword).toHaveBeenCalledWith(userData.password)
      expect(prisma.user.create).toHaveBeenCalledTimes(1)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        },
      })
    })

    it('deve hashear a senha antes de criar o usuário', async () => {
      // Arrange
      const userData = {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: 'PlainPassword123',
      }

      const hashedPassword = '$argon2id$hashed_password'

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue(hashedPassword)
      ;(prisma.user.create as jest.Mock).mockResolvedValue({
        id: 2,
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
      })

      // Act
      await createUser(userData)

      // Assert
      expect(hashPassoword).toHaveBeenCalledWith('PlainPassword123')
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          password: hashedPassword,
        }),
      })
    })
  })

  describe('Validação de Email Duplicado', () => {
    it('deve lançar erro quando email já existe', async () => {
      // Arrange
      const userData = {
        name: 'Pedro Oliveira',
        email: 'pedro@example.com',
        password: 'Test123456',
      }

      const existingUser = {
        id: 1,
        name: 'Pedro Existente',
        email: 'pedro@example.com',
        password: '$argon2id$...',
        createdAt: new Date(),
      }

      // Mock: email já existe
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser)

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow('EMAIL_ALREADY_EXISTS')

      // Verificar que não tentou criar o usuário
      expect(prisma.user.create).not.toHaveBeenCalled()
      expect(hashPassoword).not.toHaveBeenCalled()
    })

    it('deve verificar email antes de hashear senha', async () => {
      const userData = {
        name: 'Ana Costa',
        email: 'ana@example.com',
        password: 'Test123456',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'ana@example.com',
      })

      await expect(createUser(userData)).rejects.toThrow('EMAIL_ALREADY_EXISTS')

      expect(prisma.user.findUnique).toHaveBeenCalled()
      expect(hashPassoword).not.toHaveBeenCalled()
      expect(prisma.user.create).not.toHaveBeenCalled()
    })

  })

  describe('Tratamento de Erros do Prisma', () => {
    it('deve tratar erro de constraint do banco (P2002)', async () => {
      // Arrange
      const userData = {
        name: 'Carlos Lima',
        email: 'carlos@example.com',
        password: 'Test123456',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue('$argon2id$...')

      // Mock: erro de unique constraint
      const prismaError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['email'] },
        }
      )

      ;(prisma.user.create as jest.Mock).mockRejectedValue(prismaError)

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow()
    })

    it('deve propagar erros desconhecidos', async () => {
      // Arrange
      const userData = {
        name: 'Lucas Ferreira',
        email: 'lucas@example.com',
        password: 'Test123456',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue('$argon2id$...')

      const genericError = new Error('Database connection failed')
      ;(prisma.user.create as jest.Mock).mockRejectedValue(genericError)

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow('Database connection failed')
    })

    it('deve tratar erro de validação do Prisma', async () => {
      // Arrange
      const userData = {
        name: 'Juliana Alves',
        email: 'juliana@example.com',
        password: 'Test123456',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue('$argon2id$...')

      const validationError = new Error('Prisma validation error')
      validationError.name = 'PrismaClientValidationError'

      ;(prisma.user.create as jest.Mock).mockRejectedValue(validationError)

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow()
    })
  })

  describe('Integração entre Métodos', () => {
    it('deve chamar métodos na ordem correta', async () => {
      // Arrange
      const userData = {
        name: 'Roberto Silva',
        email: 'roberto@example.com',
        password: 'Test123456',
      }

      const callOrder: string[] = []

      ;(prisma.user.findUnique as jest.Mock).mockImplementation(() => {
        callOrder.push('findUnique')
        return Promise.resolve(null)
      })

      ;(hashPassoword as jest.Mock).mockImplementation(() => {
        callOrder.push('hashPassword')
        return Promise.resolve('$argon2id$...')
      })

      ;(prisma.user.create as jest.Mock).mockImplementation(() => {
        callOrder.push('create')
        return Promise.resolve({
          id: 1,
          ...userData,
          password: '$argon2id$...',
          createdAt: new Date(),
        })
      })

      // Act
      await createUser(userData)

      // Assert
      expect(callOrder).toEqual(['findUnique', 'hashPassword', 'create'])
    })
  })

  describe('Validação de Dados de Entrada', () => {
    it('deve aceitar dados válidos', async () => {
      // Arrange
      const validUserData = {
        name: 'Fernanda Costa',
        email: 'fernanda@example.com',
        password: 'ValidPass123',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue('$argon2id$...')
      ;(prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...validUserData,
        password: '$argon2id$...',
        createdAt: new Date(),
      })

      // Act
      const result = await createUser(validUserData)

      // Assert
      expect(result).toBeDefined()
      expect(result.name).toBe(validUserData.name)
      expect(result.email).toBe(validUserData.email)
    })

    it('deve preservar dados do usuário (exceto senha)', async () => {
      // Arrange
      const userData = {
        name: 'Gabriel Souza',
        email: 'gabriel@example.com',
        password: 'Test123456',
      }

      const hashedPassword = '$argon2id$...'

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue(hashedPassword)
      ;(prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date(),
      })

      // Act
      const result = await createUser(userData)

      // Assert
      expect(result.name).toBe(userData.name)
      expect(result.email).toBe(userData.email)

    })
  })

  describe('Edge Cases', () => {
    it('deve lidar com nome muito longo', async () => {
      // Arrange
      const userData = {
        name: 'A'.repeat(300), // nome com 300 caracteres
        email: 'teste@example.com',
        password: 'Test123456',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue('$argon2id$...')
      ;(prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        password: '$argon2id$...',
        createdAt: new Date(),
      })

      // Act
      const result = await createUser(userData)

      // Assert
      expect(result.name).toBe(userData.name)
    })

    it('deve lidar com email em uppercase', async () => {
      // Arrange
      const userData = {
        name: 'Teste User',
        email: 'TESTE@EXAMPLE.COM',
        password: 'Test123456',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(hashPassoword as jest.Mock).mockResolvedValue('$argon2id$...')
      ;(prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        password: '$argon2id$...',
        createdAt: new Date(),
      })

      // Act
      const result = await createUser(userData)

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'TESTE@EXAMPLE.COM' },
      })
    })
  })
})