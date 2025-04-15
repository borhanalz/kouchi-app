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

import type { IApiSendOtp, ISendOtpFormData, IApiResetPassword } from '../../types/auth';

// --------------------------------------------------

const ResetPasswordSchema = zod
  .object({
    newPassword: zod.string().min(1, { message: 'لطفا رمز عبور را وارد نمایید' }),
    confirmNewPassword: zod.string().min(1, { message: ' لطفا تکرار رمز عبور را وارد نمایید' }),
    mobileNumber: zod
      .string()
      .regex(/^09\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
      .length(11, { message: 'شماره موبایل باید 11 رقم باشد' }),
    otp: zod.string().min(6, { message: 'کد ارسالی به شماره همراه خود را وارد کنید' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'رمزهای عبور یکسان نیستند',
    path: ['confirmNewPassword'],
  });

type ResetPasswordFormType = zod.infer<typeof ResetPasswordSchema>;

// --------------------------------------------------

const AuthView = () => {
  const showPassword = useBoolean();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['update-password'],
    mutationFn: (payload: Omit<ResetPasswordFormType, 'confirmNewPassword'>) =>
      EditCreateRequest<Omit<ResetPasswordFormType, 'confirmNewPassword'>, IApiResetPassword>(
        endpoints.AUTH.CHANGE_PASSWORD,
        payload
      ),
  });

  const { mutateAsync: sendOtp } = useMutation({
    mutationKey: ['resent-otp-reset-password'],
    mutationFn: () =>
      EditCreateRequest<ISendOtpFormData, IApiSendOtp>(endpoints.AUTH.SEND_OTP, {
        mobileNumber: sessionStorage.getItem('mobileNumber') as string,
        otpType: 'login',
      }),
  });

  const methods = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      mobileNumber: sessionStorage.getItem('mobileNumber') as string,
      newPassword: '',
      confirmNewPassword: '',
      otp: '',
    },
  });

  const { handleSubmit } = methods;

  const HandleSubmit = handleSubmit(async (data) => {
    try {
      const { confirmNewPassword, ...payload } = data;
      await mutateAsync(payload);
      toast.success('با موفقیت انجام شد');
      router.push(paths.auth.password);
    } catch (error:any) {
      toast?.error(error?.message);
    }
  });

  const handleTimeReset = async () => {
    try {
      const res = await sendOtp();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2}>
        <Field.Text
          label="رمز عبور جدید"
          name="newPassword"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify icon={showPassword.value ? 'eye' : 'eye-closed'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Field.Text
          label="تکرار رمز عبور جدید"
          name="confirmNewPassword"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify icon={showPassword.value ? 'eye' : 'eye-closed'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <OtpTimer time={120} onReset={handleTimeReset} />
        <Field.Code name="otp" />
        <LoadingButton
          fullWidth
          color="primary"
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
