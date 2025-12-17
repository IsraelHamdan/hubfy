import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

import {
  GET,
  PATCH,
  DELETE,
} from '@/app/api/tasks/[id]/route'

import {
  findById,
  updateTask,
  deleteTask,
} from '@/app/lib/services/tasks.service'

/* -------------------------------------------------------------------------- */
/*                                    MOCKS                                   */
/* -------------------------------------------------------------------------- */

jest.mock('@/app/lib/services/tasks.service', () => ({
  findById: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
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


describe('GET /api/tasks/:id', () => {
  it('deve retornar a task quando existir', async () => {
    ;(findById as jest.Mock).mockResolvedValue({
      id: 'task-id',
      title: 'Minha task',
      status: 'pending',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      { method: 'GET' }
    )

    const res = await GET(req, { params: { id: 'task-id' } })

    expect(res.status).toBe(200)

    const body = await res.json()

    expect(body).toMatchObject({
      id: 'task-id',
      title: 'Minha task',
      status: 'pending',
      userId: 'user-id',
    })

    expect(findById).toHaveBeenCalledWith('task-id', 'user-id')
  })

    it('deve retornar 401 se não houver usuário autenticado', async () => {
    ;(headers as jest.Mock).mockResolvedValueOnce({
      get: () => null,
    })

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      { method: 'GET' }
    )

    const res = await GET(req, { params: { id: 'task-id' } })

    expect(res.status).toBe(401)
  })
})


describe('PATCH /api/tasks/:id', () => {
  it('deve atualizar a task do usuário autenticado', async () => {
    ;(updateTask as jest.Mock).mockResolvedValue({
      id: 'task-id',
      title: 'Minha task',
      description: null,
      status: 'completed',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
        headers: {
          'content-type': 'application/json',
        },
      }
    )

    const res = await PATCH(req, {
      params: { id: 'task-id' },
    })

    expect(res.status).toBe(200)

    const body = await res.json()

    expect(body).toMatchObject({
      id: 'task-id',
      status: 'completed',
      userId: 'user-id',
    })

    expect(typeof body.updatedAt).toBe('string')

    expect(updateTask).toHaveBeenCalledWith(
      'task-id',
      'user-id',
      { status: 'completed' }
    )
  })

  it('deve retornar 401 se não houver usuário autenticado', async () => {
    ;(headers as jest.Mock).mockResolvedValueOnce({
      get: () => null,
    })

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
        headers: {
          'content-type': 'application/json',
        },
      }
    )

    const res = await PATCH(req, {
      params: { id: 'task-id' },
    })

    expect(res.status).toBe(401)
  })

  it('deve retornar 404 se a task não existir', async () => {
    ;(updateTask as jest.Mock).mockRejectedValue(
      new Error('TASK_NOT_FOUND')
    )

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
        headers: {
          'content-type': 'application/json',
        },
      }
    )

    const res = await PATCH(req, {
      params: { id: 'task-id' },
    })

    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body.message).toBe('Task não encontrada')
  })
})


describe('DELETE /api/tasks/:id', () => {
  it('deve deletar a task quando existir', async () => {
    ;(deleteTask as jest.Mock).mockResolvedValue({
      id: 'task-id',
    })

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      { method: 'DELETE' }
    )

    const res = await DELETE(req, { params: { id: 'task-id' } })

    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.id).toBe('task-id')

    expect(deleteTask).toHaveBeenCalledWith('task-id', 'user-id')
  })

  it('deve retornar 404 se a task não existir', async () => {
    ;(deleteTask as jest.Mock).mockRejectedValue(
      new Error('TASK_NOT_FOUND')
    )

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      { method: 'DELETE' }
    )

    const res = await DELETE(req, { params: { id: 'task-id' } })

    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body.message).toBe('Task não encontrada')
  })

  it('deve retornar 404 se a task não existir', async () => {
    ;(deleteTask as jest.Mock).mockRejectedValue(
      new Error('TASK_NOT_FOUND')
    )

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      { method: 'DELETE' }
    )

    const res = await DELETE(req, { params: { id: 'task-id' } })

    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body.message).toBe('Task não encontrada')
  })
})
