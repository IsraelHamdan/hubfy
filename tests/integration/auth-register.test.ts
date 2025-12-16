import request from 'supertest'
import { startTestServer, stopTestServer } from '../helpers/test-server'
import { Server } from 'http';

let server: Server 

beforeAll(async () => {
  server = await startTestServer()
})

afterAll(() => {
  stopTestServer()
})

describe('Auth - Register', () => {
  it('deve registrar usuário e setar cookie httpOnly', async () => {
    const res = await request(server)
      .post('/api/register')
      .send({
        name: 'User Test',
        email: 'test1@email.com',
        password: 'Password123',
      })

    expect(res.status).toBe(201)
    expect(res.body.email).toBe('test1@email.com')

    const cookies = res.headers['set-cookie']
    expect(cookies).toBeDefined()
    expect(cookies[0]).toContain('access_token')
    expect(cookies[0]).toContain('HttpOnly')
  })

  it('não deve permitir email duplicado', async () => {
    const res = await request(server)
      .post('/api/register')
      .send({
        name: 'User Test',
        email: 'test1@email.com',
        password: 'Password123',
      })

    expect(res.status).toBe(409)
  })
})



describe('Auth - Token inválido', () => {
  it('deve bloquear acesso sem token', async () => {
    const res = await request(server)
      .get('/api/tasks')

    expect(res.status).toBe(401)
  })

  it('deve bloquear acesso com token inválido', async () => {
    const res = await request(server)
      .get('/api/tasks')
      .set('Cookie', ['access_token=token_invalido'])

    expect(res.status).toBe(401)
  })
})
