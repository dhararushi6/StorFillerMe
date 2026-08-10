import React from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';

import { AppInput } from '@/components/ui/AppInput';

interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;

  label?: string;
  placeholder?: string;
  required?: boolean;

  keyboardType?: React.ComponentProps<typeof AppInput>['keyboardType'];

  secureTextEntry?: boolean;
  multiline?: boolean;

  leftIcon?: React.ComponentProps<typeof AppInput>['leftIcon'];

  rightIcon?: React.ComponentProps<typeof AppInput>['rightIcon'];

  onRightIconPress?: () => void;
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  ...inputProps
}: FormFieldProps<TFieldValues>) {
  const { field, fieldState } = useController({
    control,
    name,
  });

  return (
    <AppInput
      {...inputProps}
      value={field.value ?? ''}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
