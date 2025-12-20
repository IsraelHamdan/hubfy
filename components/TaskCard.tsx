'use client';

import { updateTaskSchema } from "@/app/lib/validatiors/tasks.schema";
import { Card, CardContent, CardTitle } from "./ui/card";
import useTasks from "@/hooks/useTasks";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { createSchemaFieldValidators } from "@/app/lib/validatiors/validationHelpers";
import { useState } from "react";
import { Button } from "./ui/button";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { RichTextEditor } from "./RicthTextEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TaskStatus } from "@/generated/prisma/enums";

export type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description?: string | null;
    status: "pending" | "in_progress" | "completed";
  };
};


export default function TaskCard({ task }: TaskCardProps) {
  const { updateMutation, deleteMutation } = useTasks();
  const validate = createSchemaFieldValidators(updateTaskSchema);
  const [isEditing, setIsEditing] = useState<boolean>(false);


  const form = useForm({
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status
    },

    validationLogic: revalidateLogic({
      mode: 'change',
      modeAfterSubmission: 'change'
    }),

    onSubmit: async ({ value }) => {
      try {
        const validate = updateTaskSchema.safeParse(value);
        if (!validate.success) return;
        updateMutation.mutate({
          taskId: task.id,
          data: validate.data,
        });
      } catch {
        toast.error("Erro ao atualizar a task");
      }
    }
  });

  const handleCancel = () => {
    // Reset dos valores para os originais
    form.setFieldValue('title', task.title);
    form.setFieldValue('description', task.description);
    form.setFieldValue('status', task.status);
    setIsEditing(false);
  };

  const statusStyles = {
    pending: 'bg-yellow-50 border-yellow-200',
    in_progress: 'bg-blue-50 border-blue-200',
    completed: 'bg-green-50 border-green-200',
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Card
        className={`transition ${statusStyles[task.status] ?? 'bg-background'
          }`}
      >
        <CardTitle className="py-3 px-4 flex-row items-center justify-between">
          <form.Field
            name="title"
            validators={validate('title')}
          >
            {(field) => (
              <Input
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value)
                }
                onBlur={field.handleBlur}
                disabled={!isEditing}
                className="text-base font-semibold"
              />
            )}
          </form.Field>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={24} />
              </Button>
            ) : (
              <div className="mt-0.5">
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  disabled={updateMutation.isPending}
                >
                  <Save size={24} />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                >
                  <X size={24} />
                </Button>
              </div>
            )}

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => deleteMutation.mutate(task.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="text-destructive" size={24} />
            </Button>
          </div>
        </CardTitle>

        <CardContent className="space-y-2 text-sm">
          <form.Field
            name="description"
            validators={validate('description')}
          >
            {(field) =>
              !isEditing ? (
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: field.state.value || '<p>Sem descrição</p>',
                  }}
                />
              ) : (
                <RichTextEditor
                  value={field.state.value ?? ''}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                />
              )
            }
          </form.Field>


          <form.Field name="status">
            {(field) =>
              isEditing ? (
                <Select
                  value={field.state.value ?? 'pending'}
                  onValueChange={(value: TaskStatus) => field.handleChange(value)}
                  onOpenChange={(open) => {
                    if (!open) field.handleBlur();
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>

                  <SelectContent position="item-aligned">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  {field.state.value === 'pending' && 'Pendente'}
                  {field.state.value === 'in_progress' && 'Em andamento'}
                  {field.state.value === 'completed' && 'Concluída'}
                </span>
              )
            }
          </form.Field>

        </CardContent>
      </Card>
    </form>
  );
}