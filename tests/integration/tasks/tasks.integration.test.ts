jest.mock('@/app/lib/services/tasks.service', () => ({
  createTask: jest.fn(),
  findAllTasksByUser: jest.fn(),
  updateTask: jest.fn()
}))


jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))


beforeEach(() => {
  jest.clearAllMocks()

  // Por padrão, todos os testes começam autenticados
  ;(headers as jest.Mock).mockResolvedValue({
    get: () => 'user-id',
  })
})

import { POST, GET } from '@/app/api/tasks/route'
import { NextRequest } from 'next/server'
import { createTask, findAllTasksByUser} from '@/app/lib/services/tasks.service'
import { headers } from 'next/headers';



describe('POST /api/tasks', () => {
  it('deve criar uma task vinculada ao usuário autenticado', async () => {
    ;(createTask as jest.Mock).mockResolvedValue({
      id: 'task-id',
      title: 'Minha task',
      description: null,
      status: 'pending',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const req = new NextRequest('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Minha task',
        status: 'pending',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const res = await POST(req)

    expect(res.status).toBe(201)

    const body = await res.json()

    expect(body).toMatchObject({
      id: 'task-id',
      title: 'Minha task',
      status: 'pending',
      userId: 'user-id',
    })

    expect(typeof body.createdAt).toBe('string')
    expect(typeof body.updatedAt).toBe('string')

    expect(createTask).toHaveBeenCalledWith('user-id', {
      title: 'Minha task',
      status: 'pending',
    })
  })

  it('deve retornar 401 se não houver usuário autenticado', async () => {
    // sobrescreve apenas para este teste
    ;(headers as jest.Mock).mockResolvedValueOnce({
      get: () => null,
    })

    const req = new NextRequest('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Task',
        status: 'pending',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  it('deve retornar 404 se o usuário não existir', async () => {
    ;(createTask as jest.Mock).mockRejectedValue(
      new Error('USER_NOT_FOUND')
    )

    const req = new NextRequest('http://localhost/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Task',
        status: 'pending',
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const res = await POST(req)

    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body.message).toBe('Usuário não encontrado')
  })
})



describe('GET /api/tasks', () => {
  it('deve retornar todas as tasks do usuário autenticado', async () => {
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Task 1',
        description: null,
        status: 'pending',
        userId: 'user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Task 2',
        description: 'Descrição',
        status: 'completed',
        userId: 'user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    ;(findAllTasksByUser as jest.Mock).mockResolvedValue(mockTasks)

    const req = new NextRequest(
      'http://localhost/api/tasks', 
      {
        method: 'GET', 
        
      }
    )

    const res = await GET(req)

    expect(res.status).toBe(200)

    const body = await res.json()

    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(2)

    expect(body[0]).toMatchObject({
      id: 'task-1',
      title: 'Task 1',
      status: 'pending',
      userId: 'user-id',
    })

    expect(typeof body[0].createdAt).toBe('string')
    expect(typeof body[0].updatedAt).toBe('string')

    expect(findAllTasksByUser).toHaveBeenCalledWith('user-id')
  })

  it('deve retornar 401 se não houver usuário autenticado', async () => {
    ;(headers as jest.Mock).mockResolvedValueOnce({
      get: () => null,
    })

    const req = new NextRequest('http://localhost/api/tasks', {
      method: 'GET',
    })

    const res = await GET(req)

    expect(res.status).toBe(401)
  })
})


