import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
};

export function RHFTextField({
                               name,
                               helperText,
                               type = 'text',
                               ...other
                             }: RHFTextFieldProps) {
  const { control } = useFormContext();

  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={
            isNumberType
              ? field.value === null || field.value === undefined || field.value === 0
                ? ""
                : field.value.toString()
              : field.value ?? ""
          }
          onChange={(event) => {
            const value = event.target.value;
            if (isNumberType) {
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                field.onChange(value === "" ? null : parseFloat(value));
              }
            } else {
              field.onChange(value);
            }
          }}
          onBlur={() => {
            if (isNumberType && field.value === "") {
              field.onChange(null);
            }
          }}
          type={isNumberType ? "text" : type}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: "off",
            ...(isNumberType && { inputMode: "decimal", pattern: "[0-9]*\\.?[0-9]*" }),
          }}
          {...other}
        />
      )}
    />
  );
}
