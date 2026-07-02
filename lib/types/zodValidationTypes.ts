import { z } from "zod/v4";

export type ZodSchema = z.core.$ZodType;
export type ZodShape = z.core.$ZodShape;
export type ZodObjectSchema<TShape extends ZodShape> = z.ZodObject<TShape>;

export type FieldTransform<
  TSchema extends ZodSchema,
  TValue = z.input<TSchema>,
> = (value: TValue) => z.input<TSchema>;

export type FieldValidators<TValue> = {
  onDynamic: ({ value }: { value: TValue }) => string | undefined;
};

export type SchemaFieldTransforms<TShape extends ZodShape> = Partial<{
  [K in keyof TShape]: FieldTransform<TShape[K]>;
}>;

export type SchemaFieldValidator<TShape extends ZodShape> = <
  K extends keyof TShape,
>(
  fieldName: K,
) => FieldValidators<z.input<TShape[K]>>;

export type ValidationTransform<TValues, TSchema extends ZodSchema> = (
  values: TValues,
) => z.input<TSchema>;

export type UseZodValidationOptions<TSchema extends ZodSchema, TValues> = {
  transform?: ValidationTransform<TValues, TSchema>;
};
