import { api } from "@/app/lib/api";
import { getQueryClient } from "@/app/lib/queryClient";
import { CreateTaskDTO, createTaskSchema, TaskResponse } from "@/app/lib/validatiors/tasks.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

type CreateTaskContext = {
  previousTasks?: TaskResponse[]
}


const createTasks = async (data: CreateTaskDTO): Promise<TaskResponse> => {
  const validate = createTaskSchema.safeParse(data)

  if(!validate.success) {
    throw new Error("Dados inválidos para criar a task")
  }
  const res = await api.post<TaskResponse>('/tasks', validate.data) 

  if(res.status !== 201) {
    throw new Error("Erro ao criar task")
  }

  return res.data
}

export const findTasksByUser = async (): Promise<TaskResponse[] | null> => {
  const res = await api.get<TaskResponse[] | null>('/tasks')

  if(res.status === 200) {
    const data = res.data 
    return data
  }

  return null
}

export default function useTasks(taskId?: string) {
  const queryClient = getQueryClient()

  const createMutation = useMutation<
    TaskResponse, 
    Error, 
    CreateTaskDTO, 
    CreateTaskContext
  >({
    mutationFn: async (data: CreateTaskDTO): Promise<TaskResponse> => {
      const task = await createTasks(data)

      if(!task) {
        throw new Error('Erro ao criar task')
      }
      return task
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({queryKey: ['tasks']})
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({queryKey: ['tasks']})

      const previousTasks = queryClient.getQueryData<TaskResponse[]>(['tasks'])

      queryClient.setQueryData<TaskResponse[]>(['tasks'], (old = []) => [
        ...old, 
        {
          id: crypto.randomUUID(),
          title: newTask.title,
          description: newTask.description ?? null,
          status: newTask.status,
          userId: "optimistic",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      return {previousTasks}
    },
    onError: (_err, _newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks)
      }
    }, 
  })

  const tasks = useQuery({
    queryKey: ["tasks"],
    queryFn: findTasksByUser
  })

  return {
    createMutation, 
    tasks
  }
}