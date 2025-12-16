import { Server } from 'http';
import request from 'supertest'

export async function registerAndLogin(server: Server, email: string) {
  const res = await request(server)
    .post('/api/register')
    .send({
      name: 'Test User',
      email,
      password: 'Password123',
    })

  const cookies = res.headers['set-cookie']
  return cookies
}
