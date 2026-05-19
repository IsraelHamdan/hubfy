import argon2 from 'argon2'

export async function hashPassoword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id, 
    memoryCost: 65536, 
    timeCost: 3,
    parallelism: 4,
  })
}

export async function verifyPassowrd(hash: string, plain: string): Promise<boolean> {
  try { 
    return await argon2.verify(hash, plain) 
  } catch(err) {
    return false
  }
  
}