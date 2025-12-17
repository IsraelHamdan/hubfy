import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { GET } from '@/app/api/tasks/[id]/route'
import { findById } from '@/app/lib/services/tasks.service'

jest.mock('@/app/lib/services/tasks.service', () => ({
  findById: jest.fn(),
}))

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

describe('Tasks - isolamento entre usuários', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('um usuário não deve acessar task de outro usuário', async () => {
    // Usuário autenticado, mas NÃO é o dono da task
    ;(headers as jest.Mock).mockResolvedValue({
      get: () => 'user-2',
    })

    // Service informa violação de ownership
    ;(findById as jest.Mock).mockRejectedValue(
      new Error('FORBIDDEN')
    )

    const req = new NextRequest(
      'http://localhost/api/tasks/task-id',
      { method: 'GET' }
    )

    const res = await GET(req, {
      params: { id: 'task-id' },
    })

    expect(res.status).toBe(403)

    const body = await res.json()
    expect(body.message).toBeDefined()
  })
})
