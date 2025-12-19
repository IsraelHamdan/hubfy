'use client';
import { createTaskSchema } from "@/app/lib/validatiors/tasks.schema";
import { createSchemaFieldValidators } from "@/app/lib/validatiors/validationHelpers";
import useTasks from "@/hooks/useTasks";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { Card, CardContent, CardTitle } from "./ui/card";
import Tipography from "./Tipography";
import { FormInput } from "./formInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RichTextEditor } from "./RicthTextEditor";
import { formStyle, taskForm } from "@/app/tailwindGlobal";
import { useState } from "react";


export default function CreateTaskFrom() {
  const { createMutation } = useTasks();
  const [selectOpen, setSelectOpen] = useState(false);
  const validate = createSchemaFieldValidators(createTaskSchema);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: ''
    },

    validationLogic: revalidateLogic({
      mode: 'blur',
      modeAfterSubmission: 'blur',
    }),

    onSubmit: async ({ value }) => {
      const parsed = createTaskSchema.safeParse({
        ...value,
        description: value.description || undefined,
        status: value.status || undefined,
      });

      if (!parsed.success) {
        // aqui você pode setar erros manualmente se quiser
        return;
      }

      createMutation.mutate(parsed.data);
    },

  });

  return (
    <Card className={taskForm.cardContainer}>
      <CardTitle className={taskForm.cardHeader}>
        <Tipography variant="h2">Nova tarefa</Tipography>
      </CardTitle>
      <CardContent
        className={`${taskForm.cardContent} ${selectOpen ? "pb-32" : ""}`}
      >
        <form className={taskForm.formContainer} onSubmit={
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }

        }>
          <form.Field name="title" validators={validate('title')}>
            {(field) => (
              <div className={taskForm.inputWrapper}>
                <label htmlFor={field.name} className={taskForm.label}>Título da tarefa</label>
                <FormInput
                  field={field}
                  placeholder="Dar comida pro cachorro"
                  onValueChange={() =>
                    field.handleChange(field.state.value)
                  }
                  onBlurCustom={field.handleBlur}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="description" validators={validate('description')}>
            {(field) => (
              <div className={formStyle.inputWrapper}>
                <label htmlFor={field.name} className={taskForm.label}>Descrição</label>
                <RichTextEditor
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="status" validators={validate('status')}>
            {(field) => (
              <div className={formStyle.inputWrapper}>
                <Select
                  value={field.state.value}
                  onValueChange={
                    (value) => field.handleChange(value)
                  }
                  onOpenChange={(open) => {
                    if (!open) field.handleBlur();
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={6}>
                    <SelectItem value="in_progress">
                      Em andamento
                    </SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <div className='w-full mt-4'>
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={formStyle.submitButton}>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}