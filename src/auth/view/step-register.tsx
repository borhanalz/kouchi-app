'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import OtpTimer from 'src/components/hook-form/otp-timer';

import { useAuthContext } from '../hooks';
import { setSession } from '../context/jwt';
import {IApiRegister} from "../../types/auth";
import { endpoints } from '../../hooks/endPoints';
import { EditCreateRequest } from '../../lib/axios';
// -----------------------------------------------------------------
interface IRegisterFormData {
  mobileNumber: string;
  otp: string;
  password: string;
  name: string;
}

export const SignUpSchema = zod.object({
  name: zod.string().min(1, { message: 'نام را بدرستی وارد کنید' }),
  mobileNumber: zod
    .string()
    .regex(/^09\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
    .min(11, { message: 'شماره موبایل باید 11 رقم باشد' })
    .max(11, { message: 'شماره موبایل باید 11 رقم باشد' }),
  password: zod.string().min(6, { message: 'رمزعبور حداقل باید 6 کاراکتر باشد' }),
  otp: zod.string().min(6, { message: 'کد ارسالی را بدرستی وارد کنید' }),
});
// ------------------------------------------------------------------
const RegisterStep = () => {
  const showPassword = useBoolean();
  const { checkUserSession } = useAuthContext();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (payload: IRegisterFormData) => EditCreateRequest<IRegisterFormData,IApiRegister>(endpoints.AUTH.REGISTER, payload),
  });

  const methods = useForm<IRegisterFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      mobileNumber: '',
      password: '',
      otp: '',
    },
  });
  const { handleSubmit } = methods;

  const handleTimeReset = () => {};
  const handleTimeOut = () => {};

  const HandleSubmit = handleSubmit(async (data: IRegisterFormData) => {
    try {
      const response = await mutateAsync(data);
      setSession(response?.token);
      await checkUserSession?.();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <Field.Text label="شماره موبایل" name="mobileNumber" />
        <Field.Text label="نام" name="name" />
        <Field.Text
          label="رمز عبور"
          name="password"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <OtpTimer time={120} onTimeOut={handleTimeOut} onReset={handleTimeReset} />
        <Field.Code name="otp" />
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isPending}
        >
          ثبت نام و ورود
        </LoadingButton>
      </Stack>
    </Form>
  );
};
export default RegisterStep;
