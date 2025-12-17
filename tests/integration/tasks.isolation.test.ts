import type { Server } from 'http'
import request from 'supertest'
import { startTestServer, stopTestServer } from '../helpers/test-server'
import { registerAndLogin } from '../helpers/auth.helper'

let server: Server | undefined

beforeAll(async () => {
  server = await startTestServer()
})

afterAll(() => {
  stopTestServer()
})


describe('Tasks - isolamento entre usuários', () => {

  it('um usuário não deve acessar tasks de outro usuário', async () => {
    // Usuário 1
    const cookiesUser1 = await registerAndLogin(
      server!,
      'user1@test.com'
    )

    // Usuário 2
    const cookiesUser2 = await registerAndLogin(
      server!,
      'user2@test.com'
    )

    // Usuário 1 cria uma task
    const taskRes = await request(server!)
      .post('/api/tasks')
      .set('Cookie', cookiesUser1)
      .send({
        title: 'Task privada',
        status: 'pending',
      })

    expect(taskRes.status).toBe(201)

    const taskId = taskRes.body.id

    // Usuário 2 tenta acessar a task do usuário 1
    const forbiddenRes = await request(server!)
      .get(`/api/tasks/${taskId}`)
      .set('Cookie', cookiesUser2)

    expect([403, 404]).toContain(forbiddenRes.status)
  })
})
