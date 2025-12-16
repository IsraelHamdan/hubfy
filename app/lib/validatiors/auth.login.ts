import z from "zod";

export const authSchema = z.object({
  password: z.string().min(6).max(12, 
    {message: "A senha deve ter entre 6 e 12 caracteres"}
  ), 
  email: z.email()
})

export type AuthDTO = z.infer<typeof authSchema>