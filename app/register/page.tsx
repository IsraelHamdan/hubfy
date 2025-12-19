'use client';
import { useAuth } from '@/components/AuthProvider';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { createSchemaFieldValidators } from '../lib/validatiors/validationHelpers';
import { createUserSchema } from '../lib/validatiors/user.schema';
import { useState } from 'react';
import { toast } from 'sonner';
import { cardStyle, formStyle } from '../tailwindGlobal';
import { FormInput } from '@/components/formInput';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import Tipography from '@/components/Tipography';

export default function RegisterPage() {
  const { register } = useAuth();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },

    validationLogic: revalidateLogic({
      mode: 'blur',
      modeAfterSubmission: 'blur'
    }),

    validators: {
      onDynamic: createUserSchema
    },

    onSubmit: async ({ value }) => {
      try {
        const validation = createUserSchema.safeParse(value);

        if (validation.success) {
          await register(value);
        }
      } catch (err) {

        toast.error("Falha no login desconhecida no login", {
          description: "Algo inesperado aconteceu tente de novo",
        });

        console.error(`Erro no login: ${err}`);
      }
    }
  });


  return (
    <div className='w-full max-w-lg'>
      <Card className={cardStyle.container}>
        <CardHeader>
          <Link href={'/login'}>
            <Tipography variant='h3'>Já tem cadastro?</Tipography>
            <Tipography
              variant='span' className="text-sm font-semibold underline underline-offset-4"
            > faça login
            </Tipography>
          </Link>
        </CardHeader>
        <CardContent className={cardStyle.content}>
          <form
            onSubmit={
              (e) => {
                e.preventDefault(),
                  e.stopPropagation();
                form.handleSubmit();
              }
            }
            className="mt-4 flex flex-col gap-4 w-full"

          >
            <form.Field name='name'>
              {(field) => (
                <div className={formStyle.inputWrapper}>
                  <label htmlFor={field.name} className='font-semibold'>Nome completo</label>
                  <FormInput
                    field={field}
                    onValueChange={field.handleChange}
                    onBlurCustom={field.handleBlur}
                    placeholder='João Pedro '
                    type='text'
                  />
                </div>
              )}
            </form.Field>

            <form.Field name='email'>
              {(field) => (
                <div className={formStyle.inputWrapper}>
                  <label htmlFor={field.name} className='font-semibold'>Seu email</label>
                  <FormInput
                    field={field}
                    onValueChange={field.handleChange}
                    onBlurCustom={field.handleBlur}
                    placeholder='Joao@gmail.com '
                    type='email'
                  />
                </div>
              )}
            </form.Field>

            <form.Field name='password'>
              {(field) => (
                <div className={formStyle.inputWrapper}>
                  <label htmlFor={field.name} className='font-semibold'>Sua senha</label>
                  <FormInput
                    field={field}
                    onValueChange={field.handleChange}
                    onBlurCustom={field.handleBlur}
                    type='password'
                  />
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
    </div>


  );
}