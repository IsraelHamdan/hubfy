import { UserResponseDTO } from "@/app/lib/validatiors/user.schema";

export type AuthResponse = {
  user: UserResponseDTO
  accessToken: string, 
  refreshToken: string
}
