import { AuthResponse } from "@/types/auth.types";
import { findUserByEmail } from "../user.service";
import { verifyPassowrd } from "../argon.service";
import { signRefresh, sing, TokenPayload } from "../token.service";
import { AuthDTO } from "@/lib/validatiors/auth.login";

export async function login(data: AuthDTO): Promise<AuthResponse> {
  try {
    const user = await findUserByEmail(data.email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const isValidPassword = await verifyPassowrd(user.password, data.password);

    if (!isValidPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await sing(payload);
    console.log("🚀 ~ login ~ accessToken:", accessToken);

    const refreshToken = await signRefresh(payload);
    console.log("🚀 ~ login ~ refreshToken:", refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  } catch (err) {
    throw err;
  }
}
