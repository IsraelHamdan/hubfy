import { api } from "@/app/lib/api";
import { getQueryClient } from "@/app/lib/queryClient";
import { CreateTaskDTO, createTaskSchema, TaskResponse, UpdateTaskDTO } from "@/app/lib/validatiors/tasks.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

type TaskContext = {
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

export const updateTask = async (data: UpdateTaskDTO, taskId: string): Promise<TaskResponse | null> => {
  const res = await api.patch<TaskResponse>(`/tasks/${taskId}`, data)

  if(res.status === 200) {
    const data = res.data 
    return data
  } 
  return null
}

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`)
}


export default function useTasks(taskId?: string) {
  const queryClient = getQueryClient()

  const createMutation = useMutation<
    TaskResponse, 
    Error, 
    CreateTaskDTO, 
    TaskContext
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

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: findTasksByUser
  })

  const updateMutation = useMutation<
    TaskResponse,
    Error,
    { taskId: string; data: UpdateTaskDTO },
    TaskContext
  >({
      mutationFn: async ({ taskId, data }) => {
        const task = await updateTask(data, taskId)
        if (!task) throw new Error('Erro ao atualizar task')
        return task
      },

      onMutate: async ({ taskId, data }) => {
        await queryClient.cancelQueries({ queryKey: ['tasks'] })

        const previousTasks =
          queryClient.getQueryData<TaskResponse[]>(['tasks'])

        queryClient.setQueryData<TaskResponse[]>(['tasks'], (old = []) =>
          old.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...data,
                  updatedAt: new Date(),
                }
              : task
          )
        )

        return { previousTasks }
      },

      onError: (_err, _vars, context) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(['tasks'], context.previousTasks)
        }
      },

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      },
    })

  const deleteMutation = useMutation<
    void,
    Error,
    string,
    TaskContext
  >({
    mutationFn: async (taskId) => {
      await deleteTask(taskId)
    },

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      const previousTasks =
        queryClient.getQueryData<TaskResponse[]>(['tasks'])

      queryClient.setQueryData<TaskResponse[]>(['tasks'], (old = []) =>
        old.filter((task) => task.id !== taskId)
      )

      return { previousTasks }
    },

    onError: (_err, _taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })



  return {
    createMutation,
    updateMutation,
    deleteMutation,

    tasks: tasksQuery.data ?? [],
    isLoading:
      tasksQuery.isPending ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    isError:
      tasksQuery.isError ||
      createMutation.isError ||
      updateMutation.isError ||
      deleteMutation.isError,

    refetch: tasksQuery.refetch,
  }
}