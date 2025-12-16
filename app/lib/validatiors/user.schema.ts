import {z} from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3,{message: "Nome muito curto"}),
  email: z.email(),
  password: z.string().min(6).max(12)
})

export type CreateUserDTO = z.infer<typeof createUserSchema>

export const updateUserSchema = createUserSchema.partial()

export type UpdateUserDTO = z.infer<typeof updateUserSchema>

export const userSchema = createUserSchema.extend({
  id: z.number(), 
  createdAt: z.date()
}).omit({password: true})

export type UserResponseDTO = z.infer<typeof userSchema>

