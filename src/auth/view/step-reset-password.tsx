'use client';

import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'minimal-shared/hooks';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import OtpTimer from 'src/components/hook-form/otp-timer';

import { FormReturnLink } from 'src/auth/components/form-return-link';

import { endpoints } from '../../hooks/endPoints';
import { EditCreateRequest } from '../../lib/axios';
import { useURLSearchParams } from '../../hooks/use-search-params';

import type { IApiResetPassword } from '../../types/auth';
// ------------------------------------------------------------------
interface IResetPassowrdFormData {
  mobileNumber: string;
  otp: string;
  newPassword: string;
}
export const ResetPasswordSchema = zod.object({
  newPassword: zod.string().min(6, { message: 'رمزعبور حداقل باید 6 کاراکتر باشد' }),
  mobileNumber: zod
    .string()
    .regex(/^09\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
    .min(11, { message: 'شماره موبایل باید 11 رقم باشد' })
    .max(11, { message: 'شماره موبایل باید 11 رقم باشد' }),
  otp: zod.string().min(6, { message: 'کد ارسالی به شماره همراه خود را وارد کنید' }),
});
// -------------------------------------------------------------------
const AuthView = () => {
  const showPassword = useBoolean();
  const router = useRouter();
  const { getParam } = useURLSearchParams();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['update-password'],
    mutationFn: (payload: IResetPassowrdFormData) =>
      EditCreateRequest<IResetPassowrdFormData, IApiResetPassword>(
        endpoints.AUTH.CHANGE_PASSWORD,
        payload
      ),
  });
  const methods = useForm<IResetPassowrdFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      mobileNumber: getParam('mobileNumber'),
      newPassword: '',
      otp: '',
    },
  });

  const { handleSubmit } = methods;
  const HandleSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
      toast.success('با موفقیت انجام شد');
      router.push(paths.auth.password);
    } catch (error) {
      console.log(error);
    }
  });

  const handleTimeReset = () => {
    console.log('test1');
  };
  const handleTimeOut = () => {
    console.log('test');
  };
  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <Field.Text
          label="رمز عبور جدید"
          name="newPassword"
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
          تغییر رمز عبور
        </LoadingButton>
        <FormReturnLink href={paths.auth.password} />
      </Stack>
    </Form>
  );
};
export default AuthView;
