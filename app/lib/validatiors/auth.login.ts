import z from "zod";
import { emailRegex } from "./regex";

export const authSchema = z.object({
  password: z.string()
    .min(6, {message: "Senha muito curta, o mínimo são 6 caracteres"})
    .max(12, 
    {message: "A senha deve ter entre 6 e 12 caracteres"}
  ), 
  email: z.email().refine(
    (val) => emailRegex.test(val), 
    {message: "O email deve ser em um formato válido"}
  )
})

export type AuthDTO = z.infer<typeof authSchema>