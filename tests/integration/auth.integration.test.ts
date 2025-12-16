import type { Server } from 'http'
import request from 'supertest'
import { startTestServer, stopTestServer } from '../helpers/test-server'

let server: Server | undefined

beforeAll(async () => {
  server = await startTestServer()
})

afterAll(() => {
  stopTestServer()
})

describe('Auth integration', () => {
  it('deve registrar usuário e setar cookie httpOnly', async () => {
    const res = await request(server!)
      .post('/api/register')
      .send({
        name: 'User Test',
        email: 'user@test.com',
        password: 'Password123',
      })

    expect(res.status).toBe(201)
    expect(res.body.email).toBe('user@test.com')
    expect(res.headers['set-cookie'][0]).toContain('HttpOnly')
  })

  it('deve bloquear acesso sem token', async () => {
    const res = await request(server!)
      .get('/api/protected') // qualquer rota protegida futura

    expect(res.status).toBe(401)
  })

  it('deve bloquear token inválido', async () => {
    const res = await request(server!)
      .get('/api/protected')
      .set('Cookie', ['access_token=token_invalido'])

    expect(res.status).toBe(401)
  })
})
