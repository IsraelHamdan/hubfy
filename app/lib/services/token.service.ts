import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_KEY!
)

const ALG = process.env.ALG!

export interface TokenPayload extends JWTPayload {
  sub: string
  email: string
}

export async function sing(payload: TokenPayload) {
  try { 
    return new SignJWT(payload)
      .setProtectedHeader({alg: ALG})
      .setIssuedAt()
      .setExpirationTime(process.env.EXPIRES_IN!)
      .sign(secret)
  } catch(err) {
    throw new Error(`Erro ao definir o token: ${err}`)
  }
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify<TokenPayload>(token, secret)
  return payload
}