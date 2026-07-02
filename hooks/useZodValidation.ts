"use client";

import type {
  FieldTransform,
  SchemaFieldTransforms,
  SchemaFieldValidator,
  UseZodValidationOptions,
  ZodObjectSchema,
  ZodSchema,
  ZodShape,
} from "@/lib/types/zodValidationTypes";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { z } from "zod/v4";

const createFieldValidators = <
  TSchema extends ZodSchema,
  TValue = z.input<TSchema>,
>(
  fieldSchema: TSchema,
  transform?: FieldTransform<TSchema, TValue>,
) => ({
  onDynamic: ({ value }: { value: TValue }) => {
    const transformedValue = transform ? transform(value) : value;
    const result = z.safeParse(fieldSchema, transformedValue);

    return result.success ? undefined : result.error.issues[0]?.message;
  },
});

type UseZodValidationReturn<
  TSchema extends ZodSchema,
  TValues,
  TShape extends ZodShape,
> = {
  validateData: (values: TValues) => z.output<TSchema> | undefined;
  fieldValidator: SchemaFieldValidator<TShape>;
};

export function useZodValidation<
  TShape extends ZodShape,
  TSchema extends ZodObjectSchema<TShape>,
  TValues = z.input<TSchema>,
>(
  schema: TSchema,
  options?: UseZodValidationOptions<TSchema, TValues> & {
    fieldTransforms?: SchemaFieldTransforms<TShape>;
  },
): UseZodValidationReturn<TSchema, TValues, TShape> {
  const transform = options?.transform;
  const fieldTransforms = options?.fieldTransforms;

  const validateData = useCallback(
    (values: TValues) => {
      const valueToValidate = transform ? transform(values) : values;
      const result = z.safeParse(schema, valueToValidate);

      if (!result.success) {
        const message = result.error.issues
          .map((iss) => {
            const field = iss.path.length ? iss.path.join(".") : "form";

            return `${field}: ${iss.message}`;
          })
          .join("\n");

        toast.error(message);
        return undefined;
      }

      return result.data;
    },
    [schema, transform],
  );

  const fieldValidator = useMemo<SchemaFieldValidator<TShape>>(() => {
    return <K extends keyof TShape>(fieldName: K) => {
      const fieldSchema = schema.shape[fieldName];
      const fieldTransform = fieldTransforms?.[fieldName];

      return createFieldValidators(fieldSchema, fieldTransform);
    };
  }, [schema, fieldTransforms]);

  return {
    validateData,
    fieldValidator,
  };
}
