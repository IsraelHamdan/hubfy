import { AuthResponse } from "@/types/auth.types";
import { AuthDTO } from "../validatiors/auth.login";
import { verifyPassowrd } from "./argon.service";
import { signRefresh, sing, TokenPayload } from "./token.service";
import { findUserByEmail } from "./user.service";

export async function login(data: AuthDTO): Promise<AuthResponse> {
  try { 
    const user = await findUserByEmail(data.email)

    if(!user)  {
      throw new Error('USER_NOT_FOUND')
    }

    const isValidPassword = await verifyPassowrd(user.password, data.password)

    if(!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const payload: TokenPayload = {
      sub: user.id, 
      email: user.email
    }

    const accessToken = await sing(payload)
    const refreshToken = await signRefresh(payload)

    return {
      user: {
        id: user.id,
        name: user.name, 
        email: user.email, 
        createdAt: user.createdAt
      },
      accessToken, 
      refreshToken
    }

  } catch(err) {
    throw err
  }
}