import { prisma } from "@/app/lib/prisma";
import { createTask, deleteTask, findAllTasksByUser, findById, updateTask } from "@/app/lib/services/tasks.service";
import { findUserById } from "@/app/lib/services/user.service";

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    task: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(), 
      delete: jest.fn(), 
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/app/lib/services/user.service', () => ({
  findUserById: jest.fn()
}))

beforeEach(() => {
  jest.clearAllMocks()
})


describe('TaskService - createTask', () => {
  it('deve criar uma task vinculada ao usuário', async () => {
    ;(findUserById as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: 'user@test.com',
    })

    const mockTask = {
      id: 'task-id',
      title: 'Minha task',
      description: null,
      status: 'pending',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.task.create as jest.Mock).mockResolvedValue(mockTask)

    const result = await createTask('user-id', {
      title: 'Minha task',
      description: null,
      status: 'pending',
    })

    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: {
            connect: { id: 'user-id' },
          },
        }),
      })
    )

    expect(result).toEqual(mockTask)
  })

  it('deve lançar erro se o usuário não existir', async () => {
    ;(findUserById as jest.Mock).mockResolvedValue(null)

    await expect(
      createTask('user-id', {
        title: 'Task',
        status: 'pending',
      })
    ).rejects.toThrow('USER_NOT_FOUND')
  })
})

describe('TaskService - updateTask (PATCH)', () => {
  it('deve atualizar uma task existente', async () => {
    const existingTask = { id: 'task-id' }
    ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(existingTask)

    const updatedTask = {
      id: 'task-id',
      status: 'completed',
    }

    ;(prisma.task.update as jest.Mock).mockResolvedValue(updatedTask)

    const result = await updateTask('task-id', 'user-id', {
      status: 'completed',
    })

    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 'task-id', userId: 'user-id' },
      data: {
        title: undefined,
        description: undefined,
        status: 'completed',
      },
    })

    expect(result).toEqual(updatedTask)
  })

  it('deve lançar erro se a task não existir', async () => {
    ;(prisma.task.findUnique as jest.Mock).mockResolvedValue(null)

    await expect(
      updateTask('task-id', 'user-id', { status: 'completed' })
    ).rejects.toThrow('TASK_NOT_FOUND')
  })
})


describe('TaskService - deleteTask', () => {
  it('deve deletar uma task existente', async () => {
    ;(prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: 'task-id' })
    ;(prisma.task.delete as jest.Mock).mockResolvedValue({ id: 'task-id' })

    const result = await deleteTask('task-id', 'user-id')

    expect(prisma.task.delete).toHaveBeenCalled()
    expect(result.id).toBe('task-id')
  })
})


describe('TaskService - findById', () => {
  it('deve retornar a task pelo id', async () => {
    const task = { id: 'task-id' }
    ;(prisma.task.findUniqueOrThrow as jest.Mock).mockResolvedValue(task)

    const result = await findById('task-id', 'user-id')
    expect(result).toEqual(task)
  })
})

describe('TaskService - findAllTasksByUser', () => {
  it('deve retornar todas as tasks do usuário', async () => {
    const tasks = [{ id: '1' }, { id: '2' }]
    ;(prisma.task.findMany as jest.Mock).mockResolvedValue(tasks)

    const result = await findAllTasksByUser('user-id')
    expect(result).toEqual(tasks)
  })
})


