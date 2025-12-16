import next from 'next'
import { createServer, Server } from 'http'
import { parse } from 'url'

let server: Server | null = null


export async function startTestServer(): Promise<Server> {
  const app = next({ dev: false })
  const handle = app.getRequestHandler()

  await app.prepare()

  server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  return new Promise<Server>((resolve) => {
    server!.listen(0, () => resolve(server!))
  })
}

export function stopTestServer(): void {
  server?.close()
  server = null
}