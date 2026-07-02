'use client';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { cardStyle, formStyle } from '../tailwindGlobal';
import { FormInput } from '@/components/formInput';
import { authSchema } from '@/lib/validatiors/auth.login';
import { Card, CardContent, } from '@/components/ui/card';
import Link from 'next/link';
import Tipography from '@/components/Tipography';
import { useZodValidation } from '@/hooks/useZodValidation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { fieldValidator } = useZodValidation(authSchema);
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },

    validationLogic: revalidateLogic({
      mode: 'change',
      modeAfterSubmission: 'change'
    }),

    validators: {
      onDynamic: authSchema
    },

    onSubmit: async ({ value }) => {
      try {
        const success = await login(value);

        if (!success) {
          toast.error("Falha no login", {
            description: "Email ou senha incorretos",
          });
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
    <div className="w-full">
      <Card className={cardStyle.container}>
        <CardContent className={cardStyle.header}>
          <Link href={'/register'}>
            <Tipography
              variant='h3'
            >É novo por aqui?
            </Tipography>

            <Tipography
              variant='span'
              className="text-sm font-semibold underline underline-offset-4"
            >faça cadastro
            </Tipography>
          </Link>
        </CardContent>
        <CardContent className={cardStyle.content}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="mt-2 flex flex-col gap-5 w-full"
          >
            <form.Field name='email' validators={fieldValidator("email")}>
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

            <form.Field name='password' validators={fieldValidator("password")}>
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