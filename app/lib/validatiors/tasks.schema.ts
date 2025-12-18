import z from "zod";

export const taskStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
])

export type TaskStatus = z.infer<typeof taskStatusSchema>

export const createTaskSchema = z.object({
  title: z.string().min(3,{ message: "nome muito curto para o titulo"}),
  description: z.string().optional().nullable(), 
  status: taskStatusSchema.default('in_progress')
})

export type CreateTaskDTO = z.infer<typeof createTaskSchema>

export const updateTaskSchema = createTaskSchema.partial()

export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>

export const taskSchema = createTaskSchema.extend({
  id: z.string(),
  createdAt: z.date(), 
  updatedAt: z.date(),
  userId: z.string()
})

export type TaskResponse = z.infer<typeof taskSchema>