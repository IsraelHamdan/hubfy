import { LoginResponseDTO } from "@/types/auth.types";
import { AuthDTO } from "../validatiors/auth.login";
import { UserResponseDTO } from "../validatiors/user.schema";
import { verifyPassowrd } from "./argon.service";
import { sing, TokenPayload } from "./token.service";
import { findUserByEmail } from "./user.service";

export async function login(data: AuthDTO): Promise<LoginResponseDTO> {
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

    const token = await sing(payload)

    return {
      user: {
        id: user.id,
        name: user.name, 
        email: user.email, 
        createdAt: user.createdAt
      },
      token
    }

  } catch(err) {
    throw err
  }
}