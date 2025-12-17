import { UserResponseDTO } from "@/app/lib/validatiors/user.schema";

export type LoginResponseDTO = {
  user: UserResponseDTO
  token: string
}
