import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_KEY!
)

const refreshSecret = new TextEncoder().encode(
  process.env.REFRESH_KEY!
)

const ALG = process.env.ALG!

export interface TokenPayload extends JWTPayload {
  sub: string
  email: string
}

export async function sing(payload: TokenPayload): Promise<string> {
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

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify<TokenPayload>(token, secret)
  return payload
}

export async function signRefresh(payload: TokenPayload):Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({alg: ALG})
    .setIssuedAt()
    .setExpirationTime(process.env.REFRESH_EXPIRES!)
    .sign(refreshSecret)
  
}

export async function verifyRefresh(token: string): Promise<TokenPayload> {
  const {payload} = await jwtVerify<TokenPayload>(
    token, 
    refreshSecret
  )

  return payload
}