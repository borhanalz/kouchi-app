import type { BoxProps } from '@mui/material/Box';
import type { MuiOtpInputProps } from 'mui-one-time-password-input';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import { MuiOtpInput } from 'mui-one-time-password-input';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import { inputBaseClasses } from '@mui/material/InputBase';

import { HelperText } from './help-text';

// ------------------------------------------------------------------------------
interface RHFCodeProps extends Omit<MuiOtpInputProps, 'onChange' | 'value'> {
  name: string;
  helperText?: string;
  maxSize?: number;
  placeholder?: string;
  slotProps?: {
    wrapper?: BoxProps;
    textfield?: Partial<MuiOtpInputProps['TextFieldsProps']>;
    helperText?: FormHelperTextProps;
  };
}
//-------------------------------------------------------------------------------
export function RHFCode({
                          name,
                          slotProps,
                          helperText,
                          maxSize = 56,
                          placeholder = '-',
                          ...other
                        }: RHFCodeProps) {
  const { control } = useFormContext();

  // A function to block non-number characters
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isNumber = /^[0-9]$/.test(event.key);
    if (!isNumber) {
      event.preventDefault();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Box
            {...slotProps?.wrapper}
            dir="rtl"
            sx={[
              {
                display: 'flex',
                justifyContent: 'center',
                direction: 'rtl',
                [`& .${inputBaseClasses.input}`]: {
                  p: 0,
                  height: 'auto',
                  aspectRatio: '1/1',
                  maxWidth: maxSize,
                },
              },
              ...(Array.isArray(slotProps?.wrapper?.sx)
                ? slotProps?.wrapper?.sx
                : [slotProps?.wrapper?.sx]),
            ]}
          >
            <MuiOtpInput
              {...field}
              autoFocus
              gap={1.5}
              length={6}
              TextFieldsProps={{
                placeholder,
                error: !!error,
                inputMode: 'numeric', // for mobile keyboards
                type: 'tel',
                onKeyPress: handleKeyPress, // 💥 prevent letters
                ...slotProps?.textfield,
              }}
              {...other}
            />
          </Box>

          <HelperText
            {...slotProps?.helperText}
            errorMessage={error?.message}
            helperText={helperText}
          />
        </>
      )}
    />
  );
}
