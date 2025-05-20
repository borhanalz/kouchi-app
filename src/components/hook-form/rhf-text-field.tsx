import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
  maxLength?:number;
  isMobileNumber?:boolean;
};

export function RHFTextField({
                               name,
                               maxLength,
                               helperText,
                               type = 'text',
                               isMobileNumber = false, // 👈 Default to false
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
            isNumberType || isMobileNumber
              ? field.value === null || field.value === undefined || field.value === 0
                ? ''
                : field.value.toString()
              : field.value ?? ''
          }
          onChange={(event) => {
            const value = event.target.value;

            if (isMobileNumber) {
              const onlyDigits = value.replace(/[^\d]/g, '');
              field.onChange(onlyDigits);
            } else if (isNumberType) {
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                field.onChange(value === '' ? null : parseFloat(value));
              }
            } else {
              field.onChange(value);
            }
          }}
          onBlur={() => {
            if ((isNumberType || isMobileNumber) && field.value === '') {
              field.onChange(null);
            }
          }}
          type={isNumberType || isMobileNumber ? 'text' : type}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
            ...(maxLength && { maxLength }),
            ...(isNumberType && { inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }),
            ...(isMobileNumber && { inputMode: 'numeric', pattern: '[0-9]*' }),
          }}
          {...other}
        />
      )}
    />
  );
}
